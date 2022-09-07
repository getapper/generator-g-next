"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const pluralize = require("pluralize");
const { requirePackages } = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["mongodb"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} model generator, follow the quick and easy configuration to create a new model!`
      )
    );

    const answers = await this.prompt([
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
    const { modelName } = this.answers;

    const relativeToModelsPath = `./models/server/${modelName}`;

    const modelCollection = kebabCase(
      pluralize(modelName.charAt(0).toLowerCase() + modelName.slice(1), 2)
    );

    // Index.tsx model file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToModelsPath, "/index.ts")),
      {
        modelName,
        modelCollection,
        modelNamePluralized: pluralize(modelName),
      }
    );
  }
};
