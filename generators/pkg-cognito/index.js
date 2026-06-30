"use strict";
const Generator = require("../../common/yeoman-generator-base");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
  extendEnv,
} = require("../../common");
const {
  configurePkgCliOptions,
  promptPkgAccept,
} = require("../../common/pkg-cli-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    configurePkgCliOptions(this, opts);
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    const configFile = getGenygConfigFile(this);
    if (configFile.packages.cognito) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG Cognito files were already installed!",
          ),
        ),
      );
      process.exit(0);
    }

    await promptPkgAccept(
      this,
      `Hi! Welcome to the official ${chalk.blue(
        "Getapper NextJS Yeoman Generator (GeNYG)",
      )}. ${chalk.red(
        "This command will install all Cognito packages for BE and FE",
      )}`,
      "pkg-cognito",
    );
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
    try {
      this.fs.copy(this.templatePath("."), this.destinationPath("."));
    } catch (err) {
      console.log(err);
    }
    try {
      this.fs.copy(this.templatePath(".*"), this.destinationPath());
    } catch (err) {
      console.log(err);
    }
  }
};
