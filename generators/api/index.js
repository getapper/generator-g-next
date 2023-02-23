"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const getEndpointHandlersTemplate = require("./templates/endpoint/handler");
const getEndpointInterfacesTemplate = require("./templates/endpoint/interfaces");
const getEndpointValidationsTemplate = require("./templates/endpoint/validations");
const getEndpointTestsTemplate = require("./templates/endpoint/index.test");
const getEndpointPageTemplate = require("./templates/page");
const { getGenygConfigFile, requirePackages } = require("../../common");
const fs = require("fs");
const { camelCase } = require("camel-case");
const { pascalCase } = require("pascal-case");

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
        .join(""),
    );
  const variables = params
    .filter((p) => p[0] === "{")
    .map((p) =>
      p
        .replace("{", "")
        .replace("}", "")
        .split("-")
        .map((p) => capitalize(p))
        .join(""),
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
    "-and-",
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
      : p,
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
        .join(""),
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

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)",
        )} API generator, follow the quick and easy configuration to create a new API!`,
      ),
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
        choices: Object.values(HttpMethods),
        default: "get",
      },
    ]);

    //cookie auth
    const config = getGenygConfigFile(this);
    if (config.packages.cookieAuth && config.cookieRoles.length !== 0) {
      Object.assign(
        answers,
        await this.prompt([
          {
            type: "confirm",
            name: "useCookieAuth",
            message: "Do you want to use cookie authentication?",
            default: false,
          },
        ]),
      );
      if (answers.useCookieAuth) {
        Object.assign(
          answers,
          await this.prompt({
            type: "list",
            name: "cookieRole",
            message: "Select a role from the list",
            choices: config.cookieRoles,
          }),
        );
      }
    }

    if (answers.route === "") {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }

  writing() {
    const { method, route, useCookieAuth, cookieRole } = this.answers;
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
          getEndpointPageTemplate(getEndpointRoutePath(params.slice(0, i + 1))),
        );
      }
    }

    // Endpoints folder
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/interfaces.ts`,
      ),
      getEndpointInterfacesTemplate(capitalize(apiName), urlParams, hasPayload),
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/validations.ts`,
      ),
      getEndpointValidationsTemplate(
        capitalize(apiName),
        urlParams,
        hasPayload,
      ),
    );
    this.fs.write(
      this.destinationPath(`./src/endpoints/${endpointFolderName}/handler.ts`),
      getEndpointHandlersTemplate(
        capitalize(apiName),
        useCookieAuth,
        (useCookieAuth ? camelCase(cookieRole) : ""),
      ),
    );
    this.fs.write(
      this.destinationPath(
        `./src/endpoints/${endpointFolderName}/index.test.ts`,
      ),
      getEndpointTestsTemplate(
        endpointFolderName,
        apiName,
        capitalize(apiName),
      ),
    );

    this.fs.copyTpl(
      this.templatePath("./endpoint/index.ejs"),
      this.destinationPath(`./src/endpoints/${endpointFolderName}/index.ts`),
      {
        useCookieAuth,
        cookieRoleCamelCase: (useCookieAuth ? camelCase(cookieRole) : ""),
      },
    );
  }
};
