"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const kebabCase = require("kebab-case");
const { pascalCase } = require("pascal-case");
const path = require("path");
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
        )} task generator, follow the quick and easy configuration to create a new task!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "taskName",
        message: "What is your task name?",
      },
    ]);

    if (answers.taskName === "") {
      this.log(yosay(chalk.red("Please give your task a name next time!")));
      process.exit(1);
      return;
    }

    answers.taskName = pascalCase(answers.taskName).trim();
    this.answers = answers;
  }

  writing() {
    const { taskName } = this.answers;
    const taskFolder = kebabCase(taskName).slice(1);

    const relativeToRootPath = `./tasks/${taskFolder}`;

    // Index.ts task file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.ts"))
    );

    this.packageJson.merge({
      scripts: {
        [`TASK:${taskName}`]: `npm run tsc-backend && node dist/tasks/${taskFolder}`,
      },
    });
  }
};
