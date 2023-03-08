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
const getEndpointHandlersTemplate = require("../../generators/api/templates/endpoint/handler");
const getEndpointInterfacesTemplate = require("../../generators/api/templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("../../generators/api/templates/endpoint/validations");
const getEndpointTestsTemplate = require("../../generators/api/templates/endpoint/index.test");
const getEndpointPageTemplate = require("../../generators/api/templates/page");
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
  const params = text
    .split("/")
    .filter((p) => p !== "")
    .map((p) => {
      if (p[0] === "{") {
        return "{" + camelCaseToDash(p.replace("{", "").replace("}", "")) + "}";
      }

      return p;
    });
  return params;
};

const getFunctionName = (method, params) => {
  const models = params
    .filter((p) => p[0] !== "{")
    .map((p) =>
      p
        .split("-")
        .map((p) => capitalize(p))
        .join("")
    );
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) =>
      p
        .replace("{", "")
        .replace("}", "")
        .split("-")
        .map((p) => capitalize(p))
        .join("")
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
    "-and-"
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
      : p
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
        .join("")
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
    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };

    // Create a new EventBridge and IAM instance
    const iamClient = new IAMClient(AWSConfig);
    const eventBridge = new EventBridge(AWSConfig);
    //const scheduler = new Scheduler(AWSConfig);

    // The following arrays will be the user's choices given by yeoman
    let scheduleRoles = ["create a new schedule role"];
    let ApiDestinationRoles = ["create a new destination role"];
    let connectionList = ["create a new connection"];
    let eventBusesList = ["create a new event bus"];

    const roles = await iamClient.send(new ListRolesCommand({})); // senza usare il send risultava undefined
    /*this.log(yosay(`${roles.Roles.map((role) =>role.RoleName)}`))*/ // test per verificare che venga restituita da iamClient lista ruoli: superto
    /*roles.Roles.map((role) => {scheduleRoles.push(
      JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument))
    );*/ //test per verificare che in generale ruoli vengano inseriti dentro array: superato
    /*const roles = await iamClient.send(new ListRolesCommand({MaxItems:1}));
    this.log(
      yosay(
        `${roles.Roles.map((role) =>
          JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument))
        )}`
      )
    );
    this.log(yosay(`${JSON.stringify(schedulerRolePolicy)}`));*/ // test per verificare che il formato delle policy dopo la stringify sia lo stesso: superato

    // we need to decode the PolicyDocument of each role, we put the valid roles in the corresponding array
    roles.Roles.map((role) => {
      if (
        JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument)) ===
        JSON.stringify(schedulerExecutionRoleDocument)
      ) {
        scheduleRoles.push(role.RoleName);
      }
      if (
        JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument)) ===
        JSON.stringify(apiDestinationExecutionRoleDocument)
      ) {
        ApiDestinationRoles.push(role.RoleName);
      }
    });

    // we put the connections in the connectionList array
    const connectionsResponse = await eventBridge.listConnections({});
    //const connectionsResponse = await eventBridge.send(new ListConnectionsCommand({})); // si comporta come sopra
    /*this.log(
      yosay(` ${connectionsResponse.Connections.map((c) => c.Name)}`)
    );*/ //test per verificare che connessioni vengano restituite
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
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler!`
      )
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
        message: "Choose an existing scheduler role or create a new one.",
        choices: scheduleRoles,
        default: "create a new schedule role",
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
        type: "list",
        name: "method",
        message: "What is your scheduler API http method?",
        choices: Object.values(HttpMethods),
        default: "get",
      },
    ]);

    if (answers.destinationRole === "create a new destination role") {
      answers.customDestination = true;
    }
    if (answers.schedulerRole === "create a new schedule role") {
      answers.customScheduler = true;
    }
    if (answers.connection === "create a new connection") {
      answers.customConnection = true;
    }
    if (answers.eventBus === "create a new event bus") {
      answers.customEventBus = true;
    }
    if (answers.route === "") {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }
    /*this.iamClient = iamClient;
    this.scheduler = scheduler;
    this.eventBridge = eventBridge;*/ //provato a esportare così: test fallito
    this.answers = answers;
  }
  async writing() {
    const {
      destinationRole,
      customDestination,
      schedulerRole,
      customScheduler,
      connection,
      customConnection,
      eventBus,
      customEventBus,
      route,
      method,
    } = this.answers;

    // Create a new EventBridge and Scheduler instance
    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json");
    const AWSConfig = {
      credentials: {
        accessKeyId: credentialAccess.accessKeyId,
        secretAccessKey: credentialAccess.secretAccessKey,
      },
      region: credentialAccess.region,
    };

    // Create a new EventBridge, IAM and Scheduler instance
    const iamClient = new IAMClient(AWSConfig);
    const eventBridge = new EventBridge(AWSConfig);
    const scheduler = new Scheduler(AWSConfig);
    const configFile = this.readDestinationJSON("package.json");
    const projectName = configFile.name;
    /*const roles = await iamClient.send(new ListRolesCommand({}));
    const test1 = route+roles.Roles[0].RoleName;
    const params = parseFromText(test1);*/ // versione alternativa a params per testare se anche nel writing ListRolesCommand funzioni: superato

    /*const {iamClient} = this.iamClient;
    const {scheduler} = this.scheduler;
    const {eventBridge} = this.eventBridge;
     */ // test per vedere se sia possibile importazione di questi valori dal prompting al writing: fallito

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
          getEndpointPageTemplate(getEndpointRoutePath(params.slice(0, i + 1)))
        );
      }
    }

    let schedulerRoleResponse = {};
    if (customScheduler) {
      // Create a new scheduler role
      schedulerRoleResponse = await iamClient.send(
        new CreateRoleCommand({
          AssumeRolePolicyDocument: JSON.stringify(
            schedulerExecutionRoleDocument
          ),
          RoleName: `genyg-${projectName}-scheduler-role`,
        })
      );
    } else {
      // Return the information of the chosen scheduler role
      schedulerRoleResponse = await iamClient.send(
        new GetRoleCommand({ RoleName: schedulerRole })
      );
    }
    /*const test3 = schedulerRoleResponse.RoleName;
    const params = parseFromText(test3);*/ // test per vedere se venga creato role: superato

    let destinationRoleResponse = {};
    if (customDestination) {
      // Create a new API destination role
      destinationRoleResponse = await iamClient.send(
        new CreateRoleCommand({
          AssumeRolePolicyDocument: JSON.stringify(
            apiDestinationExecutionRoleDocument
          ),
          RoleName: `genyg-${projectName}-API-destination-role`,
        })
      );
    } else {
      // Return the information of the chosen API destination role
      destinationRoleResponse = await iamClient.send(
        new GetRoleCommand({ RoleName: destinationRole })
      );
    }
    /*await iamClient.send(
      new PutRolePolicyCommand({
        RoleName: `genyg-${projectName}-API-destination-role`,
        PolicyDocument: `{"Version":"2012-10-17","Statement":{"Effect":"Allow","Action":["iam:AttachRolePolicy","iam:CreateRole","iam:PutRolePolicy"],"Resource":"*"}}`,
        PolicyName: `Permissions-Policy-For-Genyg-${projectName}-API-Destination-Role`,
      })
    );*/

    /*await iamClient.send(
      new AttachRolePolicyCommand({
        RoleName: `genyg-${projectName}-API-destination-role`,
        PolicyArn:
          "arn:aws:iam::aws:policy/aws-service-role/AmazonEventBridgeApiDestinationsServiceRolePolicy",
      })
    );*/ // questo mi dava errori
    /*const test4 = destinationRoleResponse.RoleName;
    const params = parseFromText(test4);*/ // test per vedere se venga creato role: superato

    let connectionResponse = {};
    if (customConnection) {
      // Create a connection which will send the authenticate requests
      const createConnectionParams = {
        AuthorizationType: "API_KEY",
        AuthParameters: {
          ApiKeyAuthParameters: {
            ApiKeyName: `genyg-${projectName}-API-Connection-Key`,
            ApiKeyValue: "EbPa9**e34Hb83@D@GNiZ2CF", // you can randomize its value
          },
        },
        Name: `genyg-${projectName}-API-Connection`,
      };

      connectionResponse = await eventBridge.createConnection(
        createConnectionParams
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
    const createApiDestinationParams = {
      ConnectionArn: connectionResponse.ConnectionArn,
      HttpMethod: method.toUpperCase(), // avevo provato urlParams, ma non va bene, così invece funziona
      InvocationEndpoint:
        "https://webhook.site/3f941233-8c73-4301-b7ad-66e05d9a6985", // l'endpoint che invocheremo credo debba seguire un formato del genere `https://${projectName}/api/${route}` // the webhook site is a test
      Name: `genyg-${projectName}-${method.toUpperCase()}-${params}`, // qua vogliamo params perché ci interessa solo il nome della route, l'url ce l'abbiamo già
      InvocationRateLimitPerSecond: 100,
    };

    const createApiDestinationResponse = await eventBridge.createApiDestination(
      createApiDestinationParams
    );

    // se creo un eventbus nuovo mi segnala errore se lo allego alla schedule perché vuole i bus di default
    let eventBusResponse = {};
    let createEventBusParams = {};
    if (customEventBus) {
      createEventBusParams = {
        Name: `genyg-${projectName}-${method.toUpperCase()}-${params}-event-bus`,
      };
      eventBusResponse = await eventBridge.createEventBus(createEventBusParams);
    } else {
      eventBusResponse = await eventBridge.describeEventBus({ Name: eventBus });
    }

    // Create a rule (a listener) which will be activated when an event with thi source: genyg-${projectName}-${method.toUpperCase()}-${apiNameCapital} will be sent
    const putRuleParams = {
      Name: `genyg-${projectName}-trigger-${method.toUpperCase()}-${params}`,
      EventPattern: JSON.stringify({
        source: [`genyg-${projectName}-${method.toUpperCase()}-${params}`],
      }),
      EventBusName: customEventBus
        ? createEventBusParams.Name
        : eventBusResponse.Name,
    };

    const putRuleResponse = await eventBridge.putRule(putRuleParams);

    // Create a  target which will be invoked when the above rule is activated
    // The march between rule and target takes place through the rule's name
    const putTargetParams = {
      Rule: putRuleParams.Name,
      Targets: [
        {
          Id: `genyg-${projectName}-${method.toUpperCase()}-${params}-target`,
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

    // con questo sono riuscita a mettere la policy al destination role
    await iamClient.send(
      new PutRolePolicyCommand({
        RoleName: `genyg-${projectName}-API-destination-role`,
        PolicyDocument: JSON.stringify(apiDestinationPolicyDocument),
        PolicyName: `genyg_${projectName}_Amazon_EventBridge_Invoke_Api_Destination`,
      })
    );

    const schedulerRoleName = `genyg-${projectName}-scheduler-role`;

    const schedulerPolicyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["events:PutEvents"],
          Resource: [eventBusResponse.Arn],
        },
      ],
    };

    await iamClient.send(
      new PutRolePolicyCommand({
        RoleName: schedulerRoleName,
        PolicyDocument: JSON.stringify(schedulerPolicyDocument),
        PolicyName: `genyg_${projectName}_Amazon_EventBridge_Scheduler_Execution_Policy`,
      })
    );

    /*const createPolicyResponse = await iamClient.send(
      new CreatePolicyCommand({
        PolicyDocument:
          '{"Version": "2012-10-17","Statement":[{"Effect": "Allow","Action":["events:PutEvents"],"Resource":["' +
          eventBusResponse.Arn +
          '"]}]}',
        PolicyName: `genyg_${projectName}_Amazon_EventBridge_Scheduler_Execution_PutEvents_Policy`,
      })
    );
    await iamClient.send(
      new AttachRolePolicyCommand({
        RoleName: schedulerRoleName,
        PolicyArn: createPolicyResponse.Policy.Arn,
      })
    );
*/
    const getRoleResponse = await iamClient.send(
      new GetRoleCommand({
        RoleName: schedulerRoleName,
      })
    );

    // Create a new schedule which will be activated every minute
    // At the activation moment a default bus whit source: genyg-${projectName}-${method.toUpperCase()}-${apiNameCapital} will be sent
    // The initial status is disabled and details are empty

    try {
      const createScheduleResponse = await scheduler.createSchedule({
        Name: `genyg-${projectName}-schedule-${method.toUpperCase()}-${params}`,
        ScheduleExpression: "cron(1 * * * ? *)",
        State: "DISABLED",
        Target: {
          RoleArn: getRoleResponse.Role.Arn,
          Arn: eventBusResponse.Arn,
          EventBridgeParameters: {
            Source: `genyg-${projectName}-${method.toUpperCase()}-${params}`,
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

    //sono stati testati con successo
    // Endpoints folder
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/interfaces.ts`
      ),
      getEndpointInterfacesTemplate(capitalize(apiName), urlParams, hasPayload)
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/validations.ts`
      ),
      getEndpointValidationsTemplate(capitalize(apiName), urlParams, hasPayload)
    );
    this.fs.write(
      this.destinationPath(`./src/endpoints/${endpointFolderName}/handler.ts`),
      getEndpointHandlersTemplate(capitalize(apiName))
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/index.test.ts`
      ),
      getEndpointTestsTemplate(endpointFolderName, apiName, capitalize(apiName))
    );
    this.fs.copy(
      this.templatePath("../../api/templates/endpoint/index.ts"),
      this.destinationPath(`./src/endpoints/${endpointFolderName}/index.ts`)
    );
  }
};
