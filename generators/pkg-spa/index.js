"use strict";
const Generator = require("../../common/yeoman-generator-base");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
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
    requirePackages(this, ["core"]);

    const configFile = getGenygConfigFile(this);
    if (configFile.packages.spa) {
      this.log(
        yosay(
          chalk.red("It looks like the GeNYG SPA files were already installed!"),
        ),
      );
      process.exit(0);
    }

    await promptPkgAccept(
      this,
      `Hi! Welcome to the official ${chalk.blue(
        "Getapper NextJS Yeoman Generator (GeNYG)",
      )}. ${chalk.red(
        "This command will install Redux, Sagas, Persist, React-Router, and everything needed to run SPAs in NextJS.",
      )}`,
      "pkg-spa",
    );
  }

  writing() {
    // New dependencies
    this.packageJson.merge({
      dependencies: {
        "@reduxjs/toolkit": "1.4.0",
        axios: "0.19.2",
        "react-redux": "8.0.2",
        "react-router-dom": "6.3.0",
        "redux-persist": "6.0.0",
        "redux-saga": "1.1.3",
      },
    });

    // Copy MUI form components
    this.fs.copy(this.templatePath(), this.destinationRoot());

    extendConfigFile(this, {
      packages: {
        spa: true,
      },
    });
  }
};
