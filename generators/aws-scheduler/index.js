const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
// let pjson = require("/package.json"); scritto così ci da errore quindi lo possiamo rimuovere
const chalk = require("chalk");
const path = require("path");
const { IAMClient } = require("@aws-sdk/client-iam"); // NON da errore
const { EventBridge } = require("@aws-sdk/client-eventbridge"); // NON da errore
const { Scheduler } = require("@aws-sdk/client-scheduler");
// const getEventbridgeScheduleTemplate = require("./templates"); questo template non ci serve e pertanto va rimosso
// il suo contenuto verrà trasferito nel writing del nostro generatore
const getEndpointHandlersTemplate = require("../../generators/api/templates/endpoint/handler"); //l'importazione avviene correttamente
const getEndpointInterfacesTemplate = require("../../generators/api/templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("../../generators/api/templates/endpoint/validations");
const getEndpointTestsTemplate = require("../../generators/api/templates/endpoint/index.test");
const getEndpointPageTemplate = require("../../generators/api/templates/page");
const fs = require("fs");

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

    const credentialAccess = this.readDestinationJSON(".genyg.ignore.json"); //lui funziona :) XD :) XD

    // Create a new EventBridge and Scheduler instance
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

    // The following arrays will be the user's choices given by yeoman
    //    RIMUOVI GLI ELEMENTI INUTILI MESSI SOLO COME TEST!!!
    let scheduleRoles = [
      "create a new schedule role",
      "sche role 1",
      "sche role 2",
    ];
    let ApiDestinationRoles = [
      "create a new destination role",
      "des role 1",
      "des role 2",
    ];
    let connectionList = ["create a new connection", "conn 1", "conn 2"];

    // MANCANTI: listRoles, listConnection, inserimento negli array connessioni e ruoli (questi ultimi secondo criterio filtro)

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

    return 0;
  }
  writing() {
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

    const configFile = this.readDestinationJSON("package.json"); //visto che mi serve nel writing e non nel prompting lo metto qui...andrà bene?
    const projectName = configFile.name;

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
  }
};
