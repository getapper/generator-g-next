"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const jsYaml = require("js-yaml");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} = require("../../common");
const {JSON_SCHEMA} = require("js-yaml");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )}. ${chalk.red(
          "This command will install Cypress, this must be executed only once"
        )}`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.cypress) {
      this.log(
        yosay(
          chalk.red("It looks like Cypress were already installed!")
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

    this.packageJson.merge({
      scripts: {
        "cypress:open": "cypress open",
        "cypress:dev": "env-cmd --verbose -f .env.cypress.test next dev",
        "cypress:build": "env-cmd --verbose -f .env.cypress.test next build",
        "cypress:start": "env-cmd --verbose -f .env.cypress.test next start",
        "e2e-test": "cypress run",
      },
      devDependencies: {
        "cypress": "12.6.0",
      },
    });

    this.fs.copy(this.templatePath(".*"), this.destinationRoot());
    this.fs.copy(this.templatePath("."), this.destinationPath());

    extendConfigFile(this, {
      packages: {
        cypress: true,
      },
    });

    //Fix TS in order to not create collision with jest
    const _extendTsConfigFile = (ts, json) => {
      ts.fs.extendJSON(ts.destinationPath("tsconfig.json"), json);
    };

    _extendTsConfigFile(this, {
      exclude: [
        "node_modules",
        "cypress",
        "cypress.config.ts",
      ]
    });


    //Update Circleci config file
    const _extendCiConfigFile = (config) => {
      const localCiConfigFile = this.fs.readJSON(this.templatePath("config.json"));

      config.jobs.deps = localCiConfigFile.jobs.deps;
      config.jobs["e2e-tests"] = localCiConfigFile.jobs["e2e-tests"];
      config.workflows["code-checks"]["jobs"].push(localCiConfigFile.workflows["code-checks"]["jobs"]);

      fs.writeFileSync(this.destinationPath(".circleci/config.yml"), jsYaml.dump(config));
    }

    if(fs.existsSync(this.destinationPath(".circleci/config.yml"))){
      const destCiConfigFile = jsYaml.load(fs.readFileSync(this.destinationPath(".circleci/config.yml")),
        { schema: JSON_SCHEMA,  json: true});
      _extendCiConfigFile(destCiConfigFile);

    }
  }
};
