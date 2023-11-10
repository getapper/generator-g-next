const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

const {
  IAMClient,
  ListRolesCommand,
  CreateRoleCommand,
  GetRoleCommand,
  PutRolePolicyCommand,
} = require("@aws-sdk/client-iam");
const { EventBridge } = require("@aws-sdk/client-eventbridge");
const { Scheduler } = require("@aws-sdk/client-scheduler");
const getEndpointHandlersTemplate = require("../api/templates/endpoint/handler");
const getEndpointInterfacesTemplate = require("../api/templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("../api/templates/endpoint/validations");
const getEndpointTestsTemplate = require("../api/templates/endpoint/index.test");
const getEndpointPageTemplate = require("../api/templates/page");
const fs = require("fs");

const schedulerExecutionRoleDocument = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { Service: "scheduler.amazonaws.com" },
      Action: "sts:AssumeRole",
    },
  ],
};
const apiDestinationExecutionRoleDocument = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { Service: "events.amazonaws.com" },
      Action: "sts:AssumeRole",
    },
  ],
};

const HttpMethods = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PUT: "put",
  PATCH: "patch",
};

const camelCaseToDash = (s) =>
  s.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();

const capitalize = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;

const parseFromText = (text) => {
  return text
    .split("/")
    .filter((p) => p !== "")
    .map((p) => {
      if (p[0] === "{") {
        return "{" + camelCaseToDash(p.replace("{", "").replace("}", "")) + "}";
      }

      return p;
    });
};

const getFunctionName = (method, params) => {
  const models = params
    .filter((p) => p[0] !== "{")
    .map((p) =>
      p
        .split("-")
        .map((p) => capitalize(p))
        .join(""),
    );
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) =>
      p
        .replace("{", "")
        .replace("}", "")
        .split("-")
        .map((p) => capitalize(p))
        .join(""),
    );
  return `${method}${models.join("")}${
    variables.length ? "By" : ""
  }${variables.join("And")}`;
};

const getEndpointRoutePath = (params) => {
  const models = params.filter((p) => p[0] !== "{");
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) => p.replace("{", "").replace("}", ""));
  return `${models.join("-")}${variables.length ? "-by-" : ""}${variables.join(
    "-and-",
  )}`;
};

const getPagesApiFolders = (params) => {
  return params.map((p) =>
    p[0] === "{"
      ? "[" +
        p
          .replace("{", "")
          .replace("}", "")
          .split("-")
          .map((p2, index) => (index ? capitalize(p2) : p2))
          .join("") +
        "]"
      : p,
  );
};

const getEndpointFolder = (method, endpointRoutePath) => {
  return `${method}-${endpointRoutePath}`;
};

const getAjaxPath = (params) => {
  const urlParams = params
    .filter((p) => p[0] === "{")
    .map((p) =>
      p
        .replace("{", "")
        .replace("}", "")
        .split("-")
        .map((p2, index) => (index ? capitalize(p2) : p2))
        .join(""),
    );
  if (urlParams.length) {
    return [
      `\`/${params
        .map((p) => {
          if (p[0] === "{") {
            return `\${params.${p
              .replace("{", "")
              .replace("}", "")
              .split("-")
              .map((p2, index) => (index ? capitalize(p2) : p2))
              .join("")}}`;
          }

          return p;
        })
        .join("/")}\``,
      urlParams,
    ];
  }

  return [`"/${params.join("/")}"`];
};

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    // Create a new EventBridge and Scheduler instance
    const { AWS } = this.readDestinationJSON(".genyg.ignore.json");
    if (
      !AWS?.accessKeyId ||
      !AWS?.secretAccessKey ||
      !AWS?.region ||
      !AWS?.apiSecretKeyValue
    ) {
      this.log(
        yosay(
          chalk.red(
            "Please specify your AWS credentials and region in the .genyg.ignore.json file!",
          ),
        ),
      );
      process.exit(0);
      return;
    }
    const AWSConfig = {
      credentials: {
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
      },
      region: AWS.region,
    };

    // Create a new EventBridge and IAM instance
    const iamClient = new IAMClient(AWSConfig);
    const eventBridge = new EventBridge(AWSConfig);
    //const scheduler = new Scheduler(AWSConfig);
    const configFile = this.readDestinationJSON("package.json");
    const projectName = configFile.name;
    // The following arrays will be the user's choices given by yeoman
    let scheduleRoles = [];
    let ApiDestinationRoles = ["create a new destination role"];
    let connectionList = ["create a new connection"];
    let eventBusesList = ["create a new event bus"];

    const roles = await iamClient.send(new ListRolesCommand({}));

    // we need to decode the PolicyDocument of each role, we put the valid roles in the corresponding array
    roles.Roles.map((role) => {
      if (
        decodeURIComponent(role.AssumeRolePolicyDocument).replace(
          /\s/gm,
          "",
        ) === JSON.stringify(schedulerExecutionRoleDocument).replace(/\s/gm, "")
      ) {
        scheduleRoles.push(role.RoleName);
      }
      if (
        decodeURIComponent(role.AssumeRolePolicyDocument).replace(
          /\s/gm,
          "",
        ) ===
        JSON.stringify(apiDestinationExecutionRoleDocument).replace(/\s/gm, "")
      ) {
        ApiDestinationRoles.push(role.RoleName);
      }
    });
    if (scheduleRoles.length === 0) {
      this.log(
        yosay(
          chalk.red(
            "Please create a scheduler role first using yo g-next:aws-scheduler-role command!",
          ),
        ),
      );
      process.exit(0);
      return;
    }

    // we put the connections in the connectionList array
    const connectionsResponse = await eventBridge.listConnections({});
    connectionsResponse.Connections.map((c) => {
      connectionList.push(c.Name);
    });

    // we put the event buses in the eventBusesList array
    const listEventBusesResponse = await eventBridge.listEventBuses({});
    listEventBusesResponse.EventBuses.map((eventBus) => {
      eventBusesList.push(eventBus.Name);
    });

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)",
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler!`,
      ),
    );

    let answers = await this.prompt([
      {
        type: "list",
        name: "destinationRole",
        message: "Choose an existing destination role or create a new one.",
        choices: ApiDestinationRoles,
        default: "create a new destination role",
      },
      {
        type: "list",
        name: "schedulerRole",
        message: "Choose an existing scheduler role.",
        choices: scheduleRoles,
      },
      {
        type: "list",
        name: "connection",
        choices: connectionList,
        message: "Choose an existing connection or create a new one.",
        default: "create a new connection",
      },
      {
        type: "list",
        name: "eventBus",
        choices: eventBusesList,
        message: "Choose an existing event bus or create a new one.",
        default: "create a new event bus",
      },
      {
        type: "input",
        name: "route",
        message: "What is your scheduler API route path?",
      },
      {
        type: "input",
        name: "invocationEndpoint",
        message:
          "Insert the endpoint url you want to invoke (most of the time is PUBLIC_WEBSITE_URL/api/{schedulerApiRoute}.",
      },
      {
        type: "list",
        name: "method",
        message: "What is your scheduler API http method?",
        choices: Object.values(HttpMethods),
        default: "get",
      },
      {
        type: "input",
        name: "invocationRate",
        message: "What is your scheduler invocation rate? (1 minutes)",
      },
      {
        type: "input",
        name: "schedulerName",
        message: "What is your scheduler name?",
      },
      {
        type: "list",
        name: "status",
        message: "What is your scheduler status?",
        choices: ["ENABLED", "DISABLED"],
        default: "DISABLED",
      },
    ]);

    if (answers.destinationRole === "create a new destination role") {
      answers.customDestination = true;
    }
    if (answers.connection === "create a new connection") {
      answers.customConnection = true;
    }
    if (answers.eventBus === "create a new event bus") {
      answers.customEventBus = true;
    }
    if (answers.route === "") {
      this.log(yosay(chalk.red("Please specify a route!")));
      process.exit(1);
      return;
    }
    if (answers.invocationEndpoint === "") {
      this.log(yosay(chalk.red("Please specify an invocation endpoint!")));
      process.exit(1);
      return;
    }
    if (answers.schedulerName === "") {
      this.log(yosay(chalk.red("Please specify a scheduler name!")));
      process.exit(1);
      return;
    }
    if (answers.invocationRate === "") {
      this.log(yosay(chalk.red("Please specify an invocation rate!")));
      process.exit(1);
      return;
    }

    let schedulerName = answers.schedulerName;
    const eventBusName = `genyg-${projectName}-${schedulerName}-event-bus`;
    if (eventBusName.length >= 64) {
      const availableLength =
        64 - String(`genyg-${projectName}--event-bus`).length;
      let iterator = true;
      while (iterator) {
        let schedulerParams = await this.prompt({
          type: "input",
          name: "schedulerName",
          message: `The actual name for your scheduler is genyg-${projectName}-schedule-${schedulerName} but unfortunately is too long, please insert a shorter string, the new name of your scheduler will be genyg-${projectName}-schedule-{schedulerName}-event-bus, please take note that {schedulerName} could be maximum ${availableLength} characters (insert only the {newName} string): `,
        });
        if (
          String(
            `genyg-${projectName}-${schedulerParams.schedulerName}-event-bus`,
          ).length <= 64
        ) {
          iterator = false;
          answers.schedulerName = schedulerParams.schedulerName;
        }
      }
    }
    this.answers = answers;
  }
  async writing() {
    const {
      destinationRole,
      customDestination,
      schedulerRole,
      connection,
      customConnection,
      eventBus,
      customEventBus,
      route,
      method,
      invocationEndpoint,
      invocationRate,
      status,
      schedulerName,
    } = this.answers;

    const configFile = this.readDestinationJSON("package.json");
    const projectName = configFile.name;
    // Create a new EventBridge and Scheduler instance
    const { AWS } = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: AWS.accessKeyId,
        secretAccessKey: AWS.secretAccessKey,
      },
      region: AWS.region,
    };

    // Create a new EventBridge, IAM and Scheduler instance
    const iamClient = new IAMClient(AWSConfig);
    const eventBridge = new EventBridge(AWSConfig);
    const scheduler = new Scheduler(AWSConfig);

    // same as api generator
    const params = parseFromText(route);
    const endpointRoutePath = getEndpointRoutePath(params);
    const endpointFolderName = getEndpointFolder(method, endpointRoutePath);
    const apiName = getFunctionName(method, params);
    const [routePath, urlParams] = getAjaxPath(params);
    const pagesApiFolders = getPagesApiFolders(params);
    const hasPayload = [
      HttpMethods.PATCH,
      HttpMethods.POST,
      HttpMethods.PUT,
    ].includes(method);
    const [amount, timeUnit] = invocationRate.split(" ");
    if (Number.isNaN(amount)) {
      throw new Error("rate amount must be a number!");
    }
    if (
      !(timeUnit === "minutes" || timeUnit === "hours" || timeUnit === "days")
    ) {
      throw new Error("time unit must be minutes, hours or days!");
    }

    let currentRoute = "";
    for (let i = 0; i < pagesApiFolders.length; i++) {
      const folder = pagesApiFolders[i];
      currentRoute += folder + "/";
      const relativeToPagesFolder = `./src/pages/api/${currentRoute}/`;
      if (
        !(
          fs.existsSync(relativeToPagesFolder) &&
          fs.lstatSync(relativeToPagesFolder).isDirectory()
        )
      ) {
        fs.mkdirSync(relativeToPagesFolder);
      }
      if (!fs.existsSync(`${relativeToPagesFolder}index.ts`)) {
        this.fs.write(
          this.destinationPath(`${relativeToPagesFolder}index.ts`),
          getEndpointPageTemplate(getEndpointRoutePath(params.slice(0, i + 1))),
        );
      }
    }

    let destinationRoleResponse = {};
    if (customDestination) {
      // Create a new API destination role
      destinationRoleResponse = await iamClient.send(
        new CreateRoleCommand({
          AssumeRolePolicyDocument: JSON.stringify(
            apiDestinationExecutionRoleDocument,
          ),
          RoleName: `genyg-${projectName}-API-destination-role`,
        }),
      );
    } else {
      // Return the information of the chosen API destination role
      destinationRoleResponse = await iamClient.send(
        new GetRoleCommand({ RoleName: destinationRole }),
      );
    }

    let connectionResponse = {};
    if (customConnection) {
      // Create a connection which will send the authenticate requests
      const createConnectionParams = {
        AuthorizationType: "API_KEY",
        AuthParameters: {
          ApiKeyAuthParameters: {
            ApiKeyName: `genyg-${projectName}-api-connection-key`,
            ApiKeyValue: AWS.apiSecretKeyValue,
          },
        },
        Name: `genyg-${projectName}-API-Connection`,
      };

      connectionResponse = await eventBridge.createConnection(
        createConnectionParams,
      );
    } else {
      // return the information of the chosen connection
      connectionResponse = await eventBridge.describeConnection({
        Name: connection,
      });
    }
    /*const test2 = connectionResponse.ConnectionState;
    const params = parseFromText(test2);*/

    // Create the endpoint and specify which connection use
    const apiDestinationName = `genyg-${projectName}-${schedulerName}`;
    const createApiDestinationParams = {
      ConnectionArn: connectionResponse.ConnectionArn,
      HttpMethod: method.toUpperCase(),
      InvocationEndpoint: invocationEndpoint,
      Name: apiDestinationName,
      InvocationRateLimitPerSecond: 100,
    };

    const createApiDestinationResponse = await eventBridge.createApiDestination(
      createApiDestinationParams,
    );

    // get the information of an existing event bus (best choice) ore create a new event bus
    let eventBusResponse = {};
    let createEventBusParams = {};
    const eventBusName = `genyg-${projectName}-${schedulerName}-event-bus`;
    if (customEventBus) {
      createEventBusParams = {
        Name: eventBusName,
      };
      eventBusResponse = await eventBridge.createEventBus(createEventBusParams);
    } else {
      eventBusResponse = await eventBridge.describeEventBus({ Name: eventBus });
    }

    // Create a rule (a listener) which will be activated when an event with thi source: genyg-${projectName}-${method.toUpperCase()}-${apiNameCapital} will be sent
    const ruleName = `genyg-${projectName}-trigger-${schedulerName}`;
    const putRuleParams = {
      Name: ruleName,
      EventPattern: JSON.stringify({
        source: [apiDestinationName],
      }),
      EventBusName: customEventBus
        ? createEventBusParams.Name
        : eventBusResponse.Name,
    };

    const putRuleResponse = await eventBridge.putRule(putRuleParams);

    // Create a  target which will be invoked when the above rule is activated
    // The march between rule and target takes place through the rule's name
    const targetName = `genyg-${projectName}-${schedulerName}-target`;
    const putTargetParams = {
      Rule: putRuleParams.Name,
      Targets: [
        {
          Id: targetName,
          Arn: createApiDestinationResponse.ApiDestinationArn,
          RoleArn: destinationRoleResponse.Role.Arn,
        },
      ],
    };

    const putTargetResponse = await eventBridge.putTargets(putTargetParams);

    const apiDestinationPolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["events:InvokeApiDestination"],
          Resource: [createApiDestinationResponse.ApiDestinationArn],
        },
      ],
    };

    // put the authorization policy to the destination role
    await iamClient.send(
      new PutRolePolicyCommand({
        RoleName: `genyg-${projectName}-API-destination-role`,
        PolicyDocument: JSON.stringify(apiDestinationPolicyDocument),
        PolicyName: `genyg_${projectName}_Amazon_EventBridge_Invoke_Api_Destination`,
      }),
    );

    const getRoleResponse = await iamClient.send(
      new GetRoleCommand({
        RoleName: schedulerRole,
      }),
    );

    // Create a new schedule which will be activated every minute
    // At the activation moment a default bus whit source: genyg-${projectName}-${method.toUpperCase()}-${apiNameCapital} will be sent
    // The initial status is disabled and details are empty

    try {
      const schedulerNameInput = `genyg-${projectName}-schedule-${schedulerName}`;
      const createScheduleResponse = await scheduler.createSchedule({
        Name: schedulerNameInput,
        ScheduleExpression: `rate(${amount} ${timeUnit})`,
        State: status,
        Target: {
          RoleArn: getRoleResponse.Role.Arn,
          Arn: eventBusResponse.Arn,
          EventBridgeParameters: {
            Source: apiDestinationName,
            DetailType: JSON.stringify({}),
          },
        },
        FlexibleTimeWindow: {
          Mode: "OFF",
        },
      });
    } catch (error) {
      console.log(error);
    }

    // Endpoints folder
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/interfaces.ts`,
      ),
      getEndpointInterfacesTemplate(capitalize(apiName), urlParams, hasPayload),
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/validations.ts`,
      ),
      getEndpointValidationsTemplate(
        capitalize(apiName),
        urlParams,
        hasPayload,
      ),
    );

    //test di creazione senza cookie auth
    this.fs.write(
      this.destinationPath(`./src/endpoints/${endpointFolderName}/handler.ts`),
      getEndpointHandlersTemplate(capitalize(apiName)),
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/index.test.ts`,
      ),
      getEndpointTestsTemplate(
        endpointFolderName,
        apiName,
        capitalize(apiName),
      ),
    );
    this.fs.copyTpl(
      this.templatePath("./endpoint/index.ejs"),
      this.destinationPath(`./src/endpoints/${endpointFolderName}/index.ts`),
    );
  }
};
