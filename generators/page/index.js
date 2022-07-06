"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");

module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory")
    );
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} page generator, follow the quick and easy configuration to create a new page!`
      )
    );

    const answers = await this.prompt([
      {
        type: "directory",
        name: "pagePath",
        message: "Select where to create the page:",
        basePath: "./pages",
      },
      {
        type: "input",
        name: "pageName",
        message: "What is your page name?",
      },
    ]);

    if (answers.pageName === "") {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }

    answers.pageName = pascalCase(answers.pageName).trim();
    this.answers = answers;
  }

  writing() {
    const { pagePath, pageName } = this.answers;
    const folderName = kebabCase(pageName)
      .split("-")
      .filter((s) => s !== "")
      .join("-");

    const relativeToRootPath = `./pages/${
      pagePath ? pagePath + "/" : ""
    }${folderName}`;

    // Index.tsx page file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      {
        ...this.answers,
      }
    );
  }
};
