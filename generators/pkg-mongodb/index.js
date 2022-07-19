"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}. ${chalk.red(
          "This command must be executed only once, and it will install all MongoDB dependencies."
        )}`
      )
    );

    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
      },
    ]);

    if (!this.answers.accept) {
      process.exit(0);
    }
  }

  writing() {
    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.mongodb) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG MongoDB deps were already installed!"
          )
        )
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        mongodb: "4.4.0",
      },
    });

    // Copy MUI form components
    this.fs.copy(this.templatePath(), this.destinationRoot());

    extendConfigFile(this, {
      packages: {
        mongodb: true,
      },
    });
  }
};
