const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");
const path = require("path");
const { IAMClient, ListRolesCommand } = require("@aws-sdk/client-iam"); // NON da errore
const { EventBridge } = require("@aws-sdk/client-eventbridge");
const { Scheduler } = require("@aws-sdk/client-scheduler");
const getEndpointHandlersTemplate = require("../../generators/api/templates/endpoint/handler");
const getEndpointInterfacesTemplate = require("../../generators/api/templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("../../generators/api/templates/endpoint/validations");
const getEndpointTestsTemplate = require("../../generators/api/templates/endpoint/index.test");
const getEndpointPageTemplate = require("../../generators/api/templates/page");
const fs = require("fs");

// scritte in questo formato perché sennò succedevano cose strane nel stringify
const schedulerRolePolicy = `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"scheduler.amazonaws.com"},"Action":"sts:AssumeRole"}]}`;
const destinationRolePolicy = `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"events.amazonaws.com"},"Action":"sts:AssumeRole"}]}`;

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
        JSON.stringify(schedulerRolePolicy)
      ) {
        scheduleRoles.push(
          JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument))
        );
      }
      if (
        JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument)) ===
        JSON.stringify(destinationRolePolicy)
      ) {
        ApiDestinationRoles.push(
          JSON.stringify(decodeURIComponent(role.AssumeRolePolicyDocument))
        );
      }
    });

    // we put the connections in the connectionList array
    const connectionsResponse = await eventBridge.listConnections({}); //sembra funzionare, non da errori
    connectionsResponse.Connections.map((c) => {
      connectionList.push(c.Name);
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
      route,
      method,
    } = this.answers;
    /*const {iamClient} = this.iamClient;
    const {scheduler} = this.scheduler;
    const {eventBridge} = this.eventBridge;
     */ // test per vedere se sia possibile importazione di questi valori dal prompting al writing: fallito

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
