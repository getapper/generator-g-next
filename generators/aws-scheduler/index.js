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

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler! ${
          configFile.name
        } ${AWSConfig.region}${AWSConfig.credentials.secretAccessKey}`
      )
    );
    return 0;
  }
};
