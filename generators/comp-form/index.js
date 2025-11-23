"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { pascalCase } = require("pascal-case");
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
    this.option('componentName', {
      type: String,
      description: 'Form component name (will be prefixed with "Form")'
    });
  }

  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory")
    );
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core", "mui"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['componentName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} form component generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        componentName: commonSchemas.name
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      // Add "Form" prefix if not already present
      let componentName = pascalCase(this.options.componentName).trim();
      if (!componentName.startsWith('Form')) {
        componentName = 'Form' + componentName;
      }

      this.answers = {
        componentName: componentName
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} form component generator, follow the quick and easy configuration to create a new form component!`
        )
      );

      const answers = await this.prompt([
        {
          type: "input",
          name: "componentName",
          message: "What is your form component name? (will be prefixed with 'Form')",
        },
      ]);

      if (answers.componentName === "") {
        this.log(
          yosay(chalk.red("Please give your form component a name next time!"))
        );
        process.exit(1);
        return;
      }

      // Add "Form" prefix if not already present
      let componentName = pascalCase(answers.componentName).trim();
      if (!componentName.startsWith('Form')) {
        componentName = 'Form' + componentName;
      }

      answers.componentName = componentName;
      this.answers = answers;
    }
  }

  writing() {
    const { componentName } = this.answers;

    const relativeToRootPath = `./src/components/_form/${componentName}`;

    // Index.tsx component file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      {
        ...this.answers,
      }
    );

    // Index.hooks.tsx hooks file
    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.hooks.tsx")),
      {
        ...this.answers,
      }
    );
  }
};

