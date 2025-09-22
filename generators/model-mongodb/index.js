"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const pluralize = require("pluralize");
const { requirePackages } = require("../../common");
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

    // Define CLI options
    this.option('modelName', {
      type: String,
      description: 'Model name'
    });
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["mongodb"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['modelName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} MongoDB model generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        modelName: commonSchemas.name
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        modelName: pascalCase(this.options.modelName).trim()
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} MongoDB model generator, follow the quick and easy configuration to create a new model!`
        )
      );

      const answers = await this.prompt([
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
    const { modelName } = this.answers;

    const relativeToModelsPath = `./src/models/server/${modelName}`;

    const modelCollection = kebabCase(
      pluralize(modelName.charAt(0).toLowerCase() + modelName.slice(1), 2)
    );

    // Index.tsx model file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToModelsPath, "/index.ts")),
      {
        modelName,
        modelCollection,
        modelNamePluralized: pluralize(modelName),
      }
    );
  }
};
