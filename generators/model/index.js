"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const fs = require("fs");
const { pascalCase } = require("pascal-case");
const { getGenygConfigFile, requirePackages } = require("../../common");
const {
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  commonSchemas
} = require("../../common/cli-yup-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Define CLI options instead of arguments
    this.option('modelName', {
      type: String,
      description: 'Model name'
    });

    this.option('location', {
      type: String,
      description: 'Model location (client, server, common)'
    });

    // Force overwrite if CLI options are provided (non-interactive mode)
    // Set it immediately after super() so Yeoman recognizes it
    const hasCliArgs = opts.modelName && opts.location;
    if (hasCliArgs) {
      this.options.force = true;
    }
  }

  initializing() {
    // No-op: force is set in constructor
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

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

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['modelName', 'location']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} model generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        modelName: commonSchemas.name,
        location: commonSchemas.location
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        modelName: pascalCase(this.options.modelName).trim(),
        location: this.options.location.toLowerCase()
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} model generator, follow the quick and easy configuration to create a new client or server model!`
        )
      );

      const answers = await this.prompt([
        {
          type: "list",
          name: "location",
          message:
            "The model will be used in the client side with React, or in the backend with NodeJS?",
          choices: ["client", "server", "common"],
          default: "common",
        },
        {
          type: "input",
          name: "modelName",
          message: "What is your model name?",
        },
      ]);

      if (answers.modelName === "") {
        this.log(yosay(chalk.red("Please give your model a name next time!")));
        process.exit(1);
        return;
      }

      answers.modelName = pascalCase(answers.modelName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { modelName, location } = this.answers;

    const relativeToModelsPath = `./src/models/${location}/${modelName}`;

    // Index.tsx model file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToModelsPath, "/index.ts")),
      {
        modelName,
      }
    );
  }
};
