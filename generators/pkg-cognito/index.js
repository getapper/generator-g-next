"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
  extendEnv,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}. ${chalk.red(
          "This command will install all Cognito packages for BE and FE"
        )}`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.cognito) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG Cognito files were already installed!"
          )
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
      dependencies: {
        "amazon-cognito-identity-js": "5.2.9",
        "aws-amplify": "4.3.19",
        "aws-sdk": "2.1167.0",
        jsonwebtoken: "8.5.1",
        "jwk-to-pem": "2.0.5",
      },
    });

    extendConfigFile(this, {
      packages: {
        cognito: true,
      },
    });

    extendEnv(
      this,
      "",
      `NEXT_PUBLIC_COGNITO_USER_POOL_ID=***
NEXT_PUBLIC_COGNITO_CLIENT_ID=***`
    );
    extendEnv(
      this,
      "local",
      `RLN_COGNITO_AUTH_USER_POOL_ID=***
RLN_COGNITO_AUTH_USER_CLIENT_ID=***
RLN_COGNITO_AUTH_USER_REGION=***`
    );

    // Copy project files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));
    this.fs.copy(this.templatePath(".*"), this.destinationRoot());
  }
};
