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
    this.option('formName', {
      type: String,
      description: 'Form name'
    });

    this.option('formPath', {
      type: String,
      description: 'Form path (relative to src/components)'
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
    requirePackages(this, ["mui"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['formName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} form generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        formName: commonSchemas.name,
        formPath: {
          required: false,
          pattern: /^[a-zA-Z0-9\/\-]*$/,
          patternMessage: "Form path contains invalid characters. Only letters, numbers, slashes, and hyphens are allowed"
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
        formName: pascalCase(this.options.formName),
        formPath: this.options.formPath || ""
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} form generator, follow the quick and easy configuration to create a new form!`
        )
      );

      const answers = await this.prompt([
        {
          type: "directory",
          name: "formPath",
          message: "Select where to create the form:",
          basePath: "./src/components",
        },
        {
          type: "input",
          name: "formName",
          message: "What is your form name?",
        },
      ]);

      if (answers.formName === "") {
        this.log(yosay(chalk.red("Please give your form a name next time!")));
        process.exit(1);
        return;
      }

      answers.formName = pascalCase(answers.formName);
      this.answers = answers;
    }
  }

  writing() {
    const { formPath, formName } = this.answers;

    const relativeToComponentsPath = `./${
      formPath ? formPath + "/" : ""
    }${formName}`;

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
