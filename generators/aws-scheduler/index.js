const Generator = require("yeoman-generator");
const {requirePackages} = require("../../common");
const yosay = require("yosay");
const chalk = require("chalk");

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
    // dovremmo trovare un modo per vedere se esiste pacchetto aws
    // non sono sicura che quello che ho scritto sia corretto
    const c = this.readDestination("package.json").devDependencies
    if (c){}
    // Config checks
    requirePackages(this, ["core"]);

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
      default: "",}]);

    if(answers.destinationRole === ""){
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
          default: "",
        },
      ]))}
    if(answers.schedulerRole === ""){
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
