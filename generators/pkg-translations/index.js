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
          "This command must be executed only once, and it will install i18n files and libraries dependencies."
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
    if (!configFile.packages.core) {
      this.log(
        yosay(
          chalk.red(
            "It seems like the GeNYG core files are not installed yet. Run yo g-next:pkg-core to fix this."
          )
        )
      );
      process.exit(0);
    }
    if (configFile.packages.translations) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG translations package was already installed!"
          )
        )
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        i18next: "21.8.11",
        "react-i18next": "11.17.3",
      },
    });

    this.fs.extendJSON(this.destinationPath("next.config.options.json"), {
      i18n: {
        locales: ["en", "it", "fake"],
        defaultLocale: "fake",
      },
    });

    // Copy project files
    this.fs.copy(this.templatePath(".*"), this.destinationRoot());
  }
};
