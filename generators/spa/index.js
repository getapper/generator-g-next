"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const { getGenygConfigFile } = require("../../common");

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
        )} SPA generator, follow the quick and easy configuration to create a new Single Page Application!`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (!configFile.packages.redux) {
      this.log(
        yosay(
          chalk.red(
            "You need redux package installed in order to create a SPA. Run yo g-next:pkg-redux to fix this."
          )
        )
      );
      process.exit(0);
    }
    if (configFile.packages.mui) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG MUI files are already been installed!"
          )
        )
      );
      process.exit(0);
    }

    const answers = await this.prompt([
      {
        type: "directory",
        name: "spaPath",
        message: "Select where to create the SPA:",
        basePath: "./pages",
      },
      {
        type: "input",
        name: "spaName",
        message: "What is your page name?",
      },
    ]);

    if (answers.spaName === "") {
      this.log(yosay(chalk.red("Please give your SPA a name next time!")));
      process.exit(1);
      return;
    }

    answers.spaName = pascalCase(answers.spaName).trim();
    this.answers = answers;
  }

  writing() {
    const { spaPath, spaName } = this.answers;
    const folderName = kebabCase(spaName)
      .split("-")
      .filter((s) => s !== "")
      .join("-");

    const relativeToRootPath = `./pages/${
      spaPath ? spaPath + "/" : ""
    }${folderName}`;

    // Index.tsx page file
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
