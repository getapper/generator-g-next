"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const kebabCase = require("kebab-case");
const { pascalCase } = require("pascal-case");
const {
  requirePackages,
  copyEjsTemplateFolder,
  checkPackageInstalled,
} = require("../../common");
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
    this.option('taskName', {
      type: String,
      description: 'Task name'
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
    const hasCliArguments = hasCliArgs(this.options, ['taskName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} task generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        taskName: commonSchemas.name
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        taskName: pascalCase(this.options.taskName).trim()
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} task generator, follow the quick and easy configuration to create a new task!`
        )
      );

      const answers = await this.prompt([
        {
          type: "input",
          name: "taskName",
          message: "What is your task name?",
        },
      ]);

      if (answers.taskName === "") {
        this.log(yosay(chalk.red("Please give your task a name next time!")));
        process.exit(1);
        return;
      }

      answers.taskName = pascalCase(answers.taskName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { taskName } = this.answers;
    const taskFolder = kebabCase(taskName).slice(1);
    const taskFunctionName =
      taskName.slice(0, 1).toLowerCase() + taskName.slice(1);

    const relativeToRootPath = `./src/tasks/${taskFolder}`;

    copyEjsTemplateFolder(this, this.templatePath("./"), relativeToRootPath, {
      taskFunctionName,
      taskFolder,
      isMongoInstalled: checkPackageInstalled(this, "mongodb"),
    });

    this.packageJson.merge({
      scripts: {
        [`TASK:${taskName}`]: `ts-node --project tsconfig-ts-node.json -r tsconfig-paths/register src/tasks/${taskFolder}/exec`,
      },
    });
  }
};
