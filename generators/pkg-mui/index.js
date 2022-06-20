"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { getGenygConfigFile } = require("../../common");

module.exports = class extends Generator {
  async prompting() {
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
    const configFile = getGenygConfigFile(this);
    console.log(configFile);

    // PACKAGE JSON
    const pkgJson = {
      dependencies: {
        "@emotion/react": "11.8.2",
        "@emotion/styled": "11.8.1",
        "@hookform/resolvers": "1.3.5",
        "@mui/icons-material": "5.5.1",
        "@mui/material": "5.5.1",
        "react-hook-form": "6.15.4",
        yup: "0.32.9",
      },
    };

    // Extend or create package.json file in destination path
    // this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  install() {
    // this.npmInstall();
  }
};
