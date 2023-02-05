const Generator = require("yeoman-generator");
const {requirePackages} = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");
const { IAMClient} = require("@aws-sdk/client-iam");

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


module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);
    const AWSConfig = {
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID_AWS_BACKEND,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS_BACKEND,
      },
      region: process.env.REGION_AWS_BACKEND,
    };
    const iamClient = new IAMClient(AWSConfig);
    const roles= await iamClient.listRoles({});
    let scheduleRoles = ["create a new schedule role"];
    let ApiDestinationRoles = ["create a new destination role"];
    roles.map(member=>{if(member.AssumeRolePolicyDocument === "{\n" +
      "     \"Version\": \"2012-10-17\",\n" +
      "     \"Statement\": [\n" +
      "       {\n" +
      "         \"Effect\": \"Allow\",\n" +
      "         \"Principal\": {\n" +
      "           \"Service\": \"events.amazonaws.com\"\n" +
      "          },\n" +
      "         \"Action\": \"sts:AssumeRole\"\n" +
      "       }\n" +
      "     ]\n" +
      "   }"){
      ApiDestinationRoles.push(member.RoleName);
    }
    else{if(member.AssumeRolePolicyDocument === "{\n" +
      "     \"Version\": \"2012-10-17\",\n" +
      "     \"Statement\": [\n" +
      "       {\n" +
      "         \"Effect\": \"Allow\",\n" +
      "         \"Principal\": {\n" +
      "           \"Service\": \"scheduler.amazonaws.com\"\n" +
      "          },\n" +
      "         \"Action\": \"sts:AssumeRole\"\n" +
      "       }\n" +
      "     ]\n" +
      "   }"){
      scheduleRoles.push(member.RoleName);
    }}})

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} AWS scheduler generator, follow the quick and easy configuration to create a new AWS scheduler!`
      )
    );


    let answers = await this.prompt([{
      type: "list",
      name:"destinationRole",
      message: "Choose an existing destination role or create a new one.",
      choices: ApiDestinationRoles,
      default: "create a new destination role",}]);

    if(answers.destinationRole === "create a new destination role"){
      answers.customDestination = true;
      answers = {
        ...answers,
        ...(await this.prompt([
          {
            type: "input",
            name: "customDestinationRole",
            message: "What is your destination role name?",
          }]))
        }
      }

    if (answers.destinationRole === "" && answers.customDestinationRole === "") {
        this.log(yosay(chalk.red("Please give your destination role a name next time!")));
        process.exit(1);
        return;
    }

    answers = {...answers,...(await this.prompt([
        {
          type: "list",
          name:"schedulerRole",
          message: "Choose an existing scheduler role or create a new one.",
          choices: scheduleRoles,
          default: "create a new schedule role",
        },
      ]))}
    if(answers.schedulerRole === "create a new schedule role"){
      answers.customScheduler = true;
      answers = {
        ...answers,
        ...(await this.prompt([
          {
            type: "input",
            name: "customSchedulerRole",
            message: "What is your scheduler role name?",
          }]))
      }
    }

    if (answers.schedulerRole === "" && answers.customSchedulerRole === "") {
      this.log(yosay(chalk.red("Please give your scheduler role a name next time!")));
      process.exit(1);
      return;
    }
    answers = {...answers,...(await this.prompt([
        {
          type: "list",
          name:"connection",
          message: "Choose an existing connection or create a new one.",
          default: "create a new connection",
        },
      ]))}
    if(answers.schedulerRole === "create a new connection"){
      answers.customConnection = true;

    }

    answers = {...answers,...(await this.prompt([
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
      ]))}


    if (answers.route === "") {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }
  writing() {
    const {
      destinationRole,
      customDestination,
      customDestinationRole,
      schedulerRole,
      customScheduler,
      customSchedulerRole,
      connection,
      customConnection,
      route,
      method,
    } = this.answers;
  }
}
