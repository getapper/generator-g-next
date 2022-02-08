"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} page generator, follow the quick and easy configuration to create a new page!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "pageName",
        message: "What is your page name?"
      }
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
    try {
      const folderName = kebabCase(this.answers.pageName)
        .split("-")
        .filter(s => s !== "")
        .join("-");

      // Index.tsx page file
      this.fs.copyTpl(
        this.templatePath("index.ejs"),
        this.destinationPath(`./pages/${folderName}/index.tsx`),
        {
          ...this.answers
        }
      );

      // Index.hooks.tsx hooks file
      this.fs.copyTpl(
        this.templatePath("index.hooks.ejs"),
        this.destinationPath(`./pages/${folderName}/index.hooks.tsx`),
        {
          ...this.answers
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
};
