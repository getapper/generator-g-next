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
    requirePackages(this, ["mui"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} form generator, follow the quick and easy configuration to create a new form!`
      )
    );

    const answers = await this.prompt([
      {
        type: "directory",
        name: "formPath",
        message: "Select where to create the form:",
        basePath: "./components",
      },
      {
        type: "input",
        name: "formName",
        message: "What is your form name?",
      },
    ]);

    if (answers.formName === "") {
      this.log(yosay(chalk.red("Please give your form a name next time!")));
      process.exit(1);
      return;
    }

    answers.formName = pascalCase(answers.formName);
    this.answers = answers;
  }

  writing() {
    const { formPath, formName } = this.answers;

    const relativeToComponentsPath = `./${
      formPath ? formPath + "/" : ""
    }${formName}`;

    const relativeToRootPath = `./components/${relativeToComponentsPath}`;

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
