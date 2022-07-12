"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const fs = require("fs");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const pluralize = require("pluralize");
const { getGenygConfigFile } = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} model generator, follow the quick and easy configuration to create a new client or server model!`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (!configFile.packages.core) {
      this.log(
        yosay(
          chalk.red(
            "It seems like the GeNYG core files are not installed yet. Run yo g-next:pkg-core to fix this."
          )
        )
      );
      process.exit(0);
    }

    const answers = await this.prompt([
      {
        type: "list",
        name: "location",
        message:
          "The model will be used in the client side with React, or in the backend with NodeJS?",
        choices: ["client", "server", "common"],
        default: "common",
      },
      {
        type: "input",
        name: "modelName",
        message: "What is your model name?",
      },
    ]);

    if (answers.modelName === "") {
      this.log(yosay(chalk.red("Please give your model a name next time!")));
      process.exit(1);
      return;
    }

    answers.modelName = pascalCase(answers.modelName).trim();
    this.answers = answers;
  }

  writing() {
    const { modelName, location } = this.answers;

    const relativeToModelsPath = `./models/${location}/${modelName}`;

    // Index.tsx model file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToModelsPath, "/index.ts")),
      {
        modelName,
      }
    );

    // /models/***/index.ts export file
    const content = `export * from './${modelName}';\n`;
    fs.appendFileSync(
      path.join(this.destinationRoot(), "models", location, "index.ts"),
      content
    );
  }
};
