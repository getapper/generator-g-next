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
          "This command must be executed only once, and it will install al MUI dependencies."
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
    if (configFile.packages.mui) {
      this.log(
        yosay(
          chalk.red("It looks like the GeNYG MUI files were already installed!")
        )
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        "@emotion/react": "11.8.2",
        "@emotion/styled": "11.8.1",
        "@hookform/resolvers": "2.8.8",
        "@mui/icons-material": "5.11.0",
        "@mui/material": "5.11.7",
        "react-dropzone": "12.0.5",
        "react-hook-form": "7.29.0",
        yup: "0.32.9",
      },
    });

    // Copy MUI form components
    this.fs.copy(this.templatePath(), this.destinationRoot());

    extendConfigFile(this, {
      packages: {
        mui: true,
      },
    });
  }
};
