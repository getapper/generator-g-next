"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const getEndpointInterfacesTemplate = require("./templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("./templates/endpoint/validations");

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

const getEndpointFolder = (method, params) => {
  const models = params.filter((p) => p[0] !== "{");
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) => p.replace("{", "").replace("}", ""));
  return `${method}-${models.join("-")}${
    variables.length ? "-by-" : ""
  }${variables.join("-and-")}`;
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
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} API generator, follow the quick and easy configuration to create a new API!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "route",
        message: "What is your API route path?",
      },
      {
        type: "list",
        name: "method",
        message: "What is your API http method?",
        choices: ["get", "post", "patch", "put", "delete"],
        default: "get",
      },
    ]);

    if (answers.route === "") {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }

  writing() {
    const { method, route } = this.answers;
    const params = parseFromText(route);
    const endpointFolderName = getEndpointFolder(method, params);
    const apiName = getFunctionName(method, params);
    const [routePath, urlParams] = getAjaxPath(params);

    // Endpoints folder
    this.fs.write(
      this.destinationPath(`./endpoints/${endpointFolderName}/interfaces.ts`),
      getEndpointInterfacesTemplate(urlParams)
    );
    this.fs.write(
      this.destinationPath(`./endpoints/${endpointFolderName}/validations.ts`),
      getEndpointValidationsTemplate(urlParams)
    );
    this.fs.copy(
      this.templatePath("./endpoint/index.ts"),
      this.destinationPath(`./endpoints/${endpointFolderName}/index.ts`)
    );
    this.fs.copy(
      this.templatePath("./endpoint/handler.ts"),
      this.destinationPath(`./endpoints/${endpointFolderName}/handler.ts`)
    );
  }
};
