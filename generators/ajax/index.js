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
const {
  createCliConfig,
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  getAvailableSpas,
  commonSchemas
} = require("../../common/cli-yup-helper");

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
  constructor(args, opts) {
    super(args, opts);

    // Define CLI options
    this.option('route', {
      type: String,
      description: 'API route path'
    });

    this.option('method', {
      type: String,
      description: 'HTTP method (get, post, put, patch, delete)'
    });

    this.option('spaFolderName', {
      type: String,
      description: 'SPA folder name'
    });

    // Force overwrite if CLI options are provided (non-interactive mode)
    // Set it immediately after super() so Yeoman recognizes it
    const hasCliArgs = opts.route && opts.method;
    if (hasCliArgs) {
      this.options.force = true;
    }
  }

  initializing() {
    // No-op: force is set in constructor
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['route', 'method']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "generator-g-next",
          )} ajax generator! Using CLI options for non-interactive generation.`,
        ),
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        route: commonSchemas.route,
        method: commonSchemas.method,
        spaFolderName: {
          required: false,
          oneOf: getAvailableSpas(this),
          oneOfMessage: `SPA folder name must be one of: ${getAvailableSpas(this).join(', ')}`
        }
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      // Set SPA folder name if not provided
      const spas = getSpas(this);
      const spaFolderName = this.options.spaFolderName || (spas.length === 1 ? spas[0] : null);
      
      if (!spaFolderName && spas.length > 1) {
        this.log(yosay(chalk.red("SPA folder name is required when multiple SPAs are available!")));
        this.log(chalk.yellow(`Available SPAs: ${spas.join(', ')}`));
        process.exit(1);
        return;
      }

      this.answers = {
        route: this.options.route,
        method: this.options.method.toLowerCase(),
        spaFolderName: spaFolderName
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "generator-g-next",
          )} ajax generator, follow the quick and easy configuration to create a new ajax!`,
        ),
      );

      let answers = {};
      const spas = getSpas(this);
      if (spas.length > 1) {
        answers = await this.prompt([
          {
            type: "list",
            name: "spaFolderName",
            message: "In which SPA you want to create an ajax?",
            choices: getSpas(this),
          },
        ]);
      } else {
        answers.spaFolderName = spas[0];
      }

      answers = {
        ...answers,
        ...(await this.prompt([
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
        ])),
      };

      if (answers.route === "") {
        this.log(yosay(chalk.red("Please give your ajax a route next time!")));
        process.exit(1);
        return;
      }

      this.answers = answers;
    }
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
      urlParams,
    );

    this.fs.write(
      this.destinationPath(
        `${reduxStorePath}/extra-actions/apis/${folderName}/index.tsx`,
      ),
      content,
    );

    content = `export {default as ${apiName}} from './${folderName}'\n`;

    fs.appendFileSync(
      path.join(
        this.destinationRoot(),
        reduxStorePath,
        "extra-actions",
        "apis",
        "index.tsx",
      ),
      content,
    );
  }
};
