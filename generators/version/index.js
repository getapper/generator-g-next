"use strict";
const Generator = require("../../common/yeoman-generator-base");
const pkgJSON = require("../../package.json");
const yosay = require("yosay");
const chalk = require("chalk");

module.exports = class extends Generator {
  install() {
    this.log(
      yosay(
        `Welcome to the ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}, the current version is: ${
          JSON.parse(JSON.stringify(pkgJSON)).version
        }`
      )
    );
  }
};
