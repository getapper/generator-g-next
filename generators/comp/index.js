"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const fs = require("fs");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} component generator, follow the quick and easy configuration to create a new component!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "componentName",
        message: "What is your component name?"
      }
    ]);

    if (answers.componentName === "") {
      this.log(yosay(chalk.red("Please give your component a name next time!")));
      process.exit(1);
      return;
    }

    answers.componentName = pascalCase(answers.componentName).trim();
    this.answers = answers;
  }

  writing() {
    const { componentName } = this.answers;
    const relativeToComponentsPath = path.join(".", "components", componentName);

    // Index.tsx component file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToComponentsPath, "index.tsx")),
      {
        ...this.answers
      }
    );

    // Index.hooks.tsx hooks file
    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(path.join(relativeToComponentsPath, "index.hooks.tsx")),
      {
        ...this.answers
      }
    );

    // /components/index.tsx export file
    const content = `export * from './${componentName}';\n`;
    fs.appendFileSync(
      path.join(this.destinationRoot(), "components", "index.tsx"),
      content
    );
  }
};
