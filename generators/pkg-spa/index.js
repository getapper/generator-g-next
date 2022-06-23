"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { getGenygConfigFile, extendConfigFile } = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}. ${chalk.red(
          "This command will install Redux, Sagas, Persist, React-Router, and everything needed to run SPAs in NextJS."
        )}`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (!configFile.packages.core) {
      this.log(
        yosay(
          chalk.red(
            "It seems like the GeNYG core files are not installed yet. Run yo g-next:init to fix this."
          )
        )
      );
      process.exit(0);
    }
    if (configFile.packages.spa) {
      this.log(
        yosay(
          chalk.red("It looks like the GeNYG SPA files were already installed!")
        )
      );
      process.exit(0);
    }

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
    // New dependencies
    this.packageJson.merge({
      devDependencies: {
        "@types/react-redux": "7.1.9",
        "@types/react-router-dom": "^5.1.5",
      },
      dependencies: {
        "@reduxjs/toolkit": "1.4.0",
        axios: "0.19.2",
        "connected-react-router": "6.9.2",
        history: "4.10.1",
        "react-redux": "8.0.2",
        "react-router-dom": "5.2.0",
        "redux-persist": "6.0.0",
        "redux-saga": "1.1.3",
      },
      scripts: {
        postinstall: "npx patch-package",
      },
    });

    extendConfigFile(this, {
      packages: {
        spa: true,
      },
    });

    this.fs.copy(this.templatePath("."), this.destinationPath("."), {
      globOptions: { dot: true },
    });
  }
};
