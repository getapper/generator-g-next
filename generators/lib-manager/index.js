"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const fs = require("fs");
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
    this.option('managerName', {
      type: String,
      description: 'Manager name (e.g., CustomerIo, Stripe, etc.)'
    });

    // Force overwrite if CLI options are provided (non-interactive mode)
    const hasCliArgs = opts.managerName;
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

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['managerName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} lib manager generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        managerName: commonSchemas.name
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        managerName: pascalCase(this.options.managerName).trim()
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} lib manager generator, follow the quick and easy configuration to create a new manager with factory and mock!`
        )
      );

      const answers = await this.prompt([
        {
          type: "input",
          name: "managerName",
          message: "What is your manager name? (e.g., CustomerIo, Stripe, etc.)",
        },
      ]);

      if (answers.managerName === "") {
        this.log(yosay(chalk.red("Please give your manager a name next time!")));
        process.exit(1);
        return;
      }

      answers.managerName = pascalCase(answers.managerName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { managerName } = this.answers;
    // Convert PascalCase to kebab-case (e.g., CustomerIo -> customer-io)
    const managerNameKebab = managerName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
    
    // Convert PascalCase to SCREAMING_SNAKE_CASE for env var (e.g., CustomerIo -> USE_CUSTOMER_IO_MOCK)
    const envVarName = `USE_${managerName
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .toUpperCase()}_MOCK`;

    const relativeToLibPath = `./src/lib/${managerNameKebab}`;

    // Create Factory file
    this.fs.copyTpl(
      this.templatePath("ManagerFactory.ts.ejs"),
      this.destinationPath(path.join(relativeToLibPath, `${managerName}ManagerFactory.ts`)),
      {
        managerName,
        managerNameKebab,
        envVarName,
      }
    );

    // Create MockFactory file
    this.fs.copyTpl(
      this.templatePath("ManagerMockFactory.ts.ejs"),
      this.destinationPath(path.join(relativeToLibPath, `${managerName}ManagerMockFactory.ts`)),
      {
        managerName,
        managerNameKebab,
        envVarName,
      }
    );

    // Create index.ts file
    this.fs.copyTpl(
      this.templatePath("index.ts.ejs"),
      this.destinationPath(path.join(relativeToLibPath, "index.ts")),
      {
        managerName,
        managerNameKebab,
        envVarName,
      }
    );

    // Update next.config.options.json
    const nextConfigOptionsJsonPath = this.destinationPath("next.config.options.json");
    if (this.fs.exists(nextConfigOptionsJsonPath)) {
      const nextConfigOptionsJson = require(nextConfigOptionsJsonPath);
      const envVars = nextConfigOptionsJson?.env ?? [];
      
      if (!envVars.includes(envVarName)) {
        this.fs.extendJSON(nextConfigOptionsJsonPath, {
          env: [...envVars, envVarName],
        });
      }
    }

    // Update env.template
    const envTemplatePath = this.destinationPath("env.template");
    if (this.fs.exists(envTemplatePath)) {
      const envTemplateContent = this.fs.read(envTemplatePath);
      
      // Check if env var already exists
      if (!envTemplateContent.includes(envVarName)) {
        const lines = envTemplateContent.split('\n');
        
        // Find the last non-empty line
        let lastNonEmptyIndex = lines.length - 1;
        while (lastNonEmptyIndex >= 0 && lines[lastNonEmptyIndex].trim() === '') {
          lastNonEmptyIndex--;
        }
        
        // Add the env var after the last non-empty line
        lines.splice(lastNonEmptyIndex + 1, 0, `${envVarName}=false`);
        
        // Ensure file ends with newline
        if (lines[lines.length - 1] !== '') {
          lines.push('');
        }
        
        this.fs.write(envTemplatePath, lines.join('\n'));
      }
    }
  }
};
