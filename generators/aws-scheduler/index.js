const Generator = require("yeoman-generator");
const { requirePackages } = require("../../common");
const yosay = require("yosay");
// let pjson = require("/package.json"); scritto così ci da errore
const chalk = require("chalk");
const path = require("path");
const { IAMClient } = require("@aws-sdk/client-iam"); // NON da errore
const { EventBridge } = require("@aws-sdk/client-eventbridge"); // NON da errore
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
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler! ${
          configFile.name
        }`
      )
    );
    return 0;
  }
};
