"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}. ${chalk.red(
          "This command SHOULD only be executed right after create-next-app install, not sooner, not later!"
        )}\nAnd it will install Redux, Sagas, Persist, React-Router, MUI, and basic app templates.`
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
    // PACKAGE JSON
    const pkgJson = {
      devDependencies: {
        "env-cmd": "10.1.0",
        "eslint-config-prettier": "^8.5.0",
        husky: "4.2.5",
        "lint-staged": "10.2.11",
      },
      dependencies: {
        "@reduxjs/toolkit": "1.4.0",
        "@types/react-redux": "7.1.9",
        axios: "0.19.2",
        "react-redux": "7.2.0",
        yup: "0.32.9",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    /**
     * Copy all other files
     */
    this.fs.copy(this.templatePath("."), this.destinationPath("."));
    this.fs.copy(this.templatePath(".*"), this.destinationRoot());
  }

  install() {
    this.npmInstall();
  }
};
