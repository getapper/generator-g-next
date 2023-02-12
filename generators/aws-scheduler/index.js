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

const HttpMethods = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PUT: "put",
  PATCH: "patch",
};

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);
    const configFile = this.readDestinationJSON("package.json"); //DEVE stare qua dentro sennò da errore, però scritto così funziona bene
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

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler! ${
          configFile.name
        } ${AWSConfig.region}${AWSConfig.credentials.secretAccessKey}`
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

    return 0;
  }
};
