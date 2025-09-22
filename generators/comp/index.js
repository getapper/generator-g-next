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
      description: 'Component name'
    });

    this.option('componentPath', {
      type: String,
      description: 'Component path (relative to src/components)'
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
    requirePackages(this, ["core"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['componentName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} component generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        componentName: commonSchemas.name,
        componentPath: {
          required: false,
          pattern: /^[a-zA-Z0-9\/\-]*$/,
          patternMessage: "Component path contains invalid characters. Only letters, numbers, slashes, and hyphens are allowed"
        }
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        componentName: pascalCase(this.options.componentName).trim(),
        componentPath: this.options.componentPath || ""
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} component generator, follow the quick and easy configuration to create a new component!`
        )
      );

      const answers = await this.prompt([
        {
          type: "directory",
          name: "componentPath",
          message: "Select where to create the component:",
          basePath: "./src/components",
        },
        {
          type: "input",
          name: "componentName",
          message: "What is your component name?",
        },
      ]);

      if (answers.componentName === "") {
        this.log(
          yosay(chalk.red("Please give your component a name next time!"))
        );
        process.exit(1);
        return;
      }

      answers.componentName = pascalCase(answers.componentName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { componentPath, componentName } = this.answers;

    const relativeToComponentsPath = `./${
      componentPath ? componentPath + "/" : ""
    }${componentName}`;

    const relativeToRootPath = `./src/components/${relativeToComponentsPath}`;

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
