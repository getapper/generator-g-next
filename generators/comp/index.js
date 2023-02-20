"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { pascalCase } = require("pascal-case");
const { requirePackages } = require("../../common");

module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory")
    );
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} component generator, follow the quick and easy configuration to create a new component!`
      )
    );

    const answers = await this.prompt([
      {
        type: "directory",
        name: "componentPath",
        message: "Select where to create the component:",
        basePath: "./src/components",
      },
      {
        type: "input",
        name: "componentName",
        message: "What is your component name?",
      },
    ]);

    if (answers.componentName === "") {
      this.log(
        yosay(chalk.red("Please give your component a name next time!"))
      );
      process.exit(1);
      return;
    }

    answers.componentName = pascalCase(answers.componentName).trim();
    this.answers = answers;
  }

  writing() {
    const { componentPath, componentName } = this.answers;

    const relativeToComponentsPath = `./${
      componentPath ? componentPath + "/" : ""
    }${componentName}`;

    const relativeToRootPath = `./src/components/${relativeToComponentsPath}`;

    // Index.tsx component file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      {
        ...this.answers,
      }
    );

    // Index.hooks.tsx hooks file
    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.hooks.tsx")),
      {
        ...this.answers,
      }
    );
  }
};
