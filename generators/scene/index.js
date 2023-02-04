"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  getSpas,
  requirePackages,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} scene generator, follow the quick and easy configuration to create a new scene in  your SPA!`
      )
    );

    let answers = {};
    const spas = getSpas(this);
    if (spas.length > 1) {
      answers = await this.prompt([
        {
          type: "list",
          name: "spaFolderName",
          message: "In which SPA you want to create a scene?",
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
          name: "sceneName",
          message: "What is your scene name?",
        },
      ])),
    };

    if (answers.sceneName === "") {
      this.log(yosay(chalk.red("Please give your scene a name next time!")));
      process.exit(1);
      return;
    }

    answers.sceneName = pascalCase(answers.sceneName);
    this.answers = answers;
  }

  writing() {
    const { sceneName, spaFolderName } = this.answers;

    // Index.tsx scene file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(
        `./src/spas/${spaFolderName}/scenes/${sceneName}/index.tsx`
      ),
      {
        sceneName,
      }
    );

    // Index.hook.tsx scene file
    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(
        `./src/spas/${spaFolderName}/scenes/${sceneName}/index.hooks.tsx`
      ),
      {
        ...this.answers,
      }
    );

    // /scenes/index.tsx export file
    const content = `export * from './${this.answers.sceneName}';\n`;

    fs.appendFileSync(
      path.join(
        this.destinationRoot(),
        "src",
        "spas",
        spaFolderName,
        "scenes",
        "index.tsx"
      ),
      content
    );
  }
};
