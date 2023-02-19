"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const getTemplate = require("./templates/api");
const fs = require("fs");
const path = require("path");
const {
  getGenygConfigFile,
  getSpas,
  requirePackages,
} = require("../../common");

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

const getAjaxFolder = (method, params) => {
  const models = params.filter((p) => p[0] !== "{");
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) => p.replace("{", "").replace("}", ""));
  return `${method}-${models.join("-")}${
    variables.length ? "-by-" : ""
  }${variables.join("-and-")}`;
};

const getAjaxActionRoute = (method, params) => {
  return (
    "apis/" +
    params
      .map((p) => {
        if (p[0] === "{") {
          return `{${p
            .replace("{", "")
            .replace("}", "")
            .split("-")
            .map((p2, index) => (index ? capitalize(p2) : p2))
            .join("")}}`;
        }

        return p;
      })
      .join("/") +
    "/" +
    method
  );
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
    requirePackages(this, ["spa"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} ajax generator, follow the quick and easy configuration to create a new ajax!`
      )
    );

    const answers = await this.prompt([
      {
        type: "list",
        name: "spaFolderName",
        message: "In which SPA you want to create a scene?",
        choices: getSpas(this),
      },
      {
        type: "input",
        name: "route",
        message: "What is your API route?",
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
      this.log(yosay(chalk.red("Please give your ajax a route next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }

  writing() {
    const { method, route, spaFolderName } = this.answers;
    const params = parseFromText(route);
    const folderName = getAjaxFolder(method, params);
    const apiName = getFunctionName(method, params);
    const apiNamePC = pascalCase(apiName);
    const apiActionRoute = getAjaxActionRoute(method, params);
    const [routePath, urlParams] = getAjaxPath(params);
    const reduxStorePath = `./src/spas/${spaFolderName}/redux-store`;

    let content = getTemplate(
      apiNamePC,
      apiActionRoute,
      routePath,
      method.toUpperCase(),
      urlParams
    );

    this.fs.write(
      this.destinationPath(
        `${reduxStorePath}/extra-actions/apis/${folderName}/index.tsx`
      ),
      content
    );

    content = `export {default as ${apiName}} from './${folderName}'\n`;

    fs.appendFileSync(
      path.join(
        this.destinationRoot(),
        reduxStorePath,
        "extra-actions",
        "apis",
        "index.tsx"
      ),
      content
    );
  }
};
