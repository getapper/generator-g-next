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
    // New dependencies
    this.packageJson.merge({
      scripts: {
        lint: "next lint",
        tsc: "tsc",
        "tsc-backend": "rimraf dist && npx ttsc --p tsconfig-backend.json",
        test: "npm run tsc-backend && jest --runInBand",
      },
      devDependencies: {
        "custom-env": "2.0.1",
        "env-cmd": "10.1.0",
        "eslint-config-prettier": "8.5.0",
        husky: "4.2.5",
        "lint-staged": "10.2.11",
        prettier: "2.7.1",
        rimraf: "3.0.2",
        ttypescript: "1.5.13",
        "typescript-transform-paths": "3.3.1",
      },
      dependencies: {
        yup: "0.32.9",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
      jest: {
        testTimeout: 10000,
        rootDir: "dist",
        moduleNameMapper: {
          "models/(.*)": "<rootDir>/models/$1",
          "endpoints/(.*)": "<rootDir>/endpoints/$1",
          "tasks/(.*)": "<rootDir>/tasks/$1",
        },
        setupFiles: ["<rootDir>/lib/test-utils/setup-tests"],
      },
    });

    // Copy project files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));
    this.fs.copy(this.templatePath(".*"), this.destinationRoot());
  }
};
