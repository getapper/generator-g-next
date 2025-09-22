"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  getSpas,
  requirePackages,
} = require("../../common");
const {
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  getAvailableSpas,
  commonSchemas
} = require("../../common/cli-yup-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Define CLI options
    this.option('sceneName', {
      type: String,
      description: 'Scene name'
    });

    this.option('spaFolderName', {
      type: String,
      description: 'SPA folder name'
    });
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['sceneName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "generator-g-next"
          )} scene generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        sceneName: commonSchemas.name,
        spaFolderName: {
          required: false,
          oneOf: getAvailableSpas(this),
          oneOfMessage: `SPA folder name must be one of: ${getAvailableSpas(this).join(', ')}`
        }
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      // Set SPA folder name if not provided
      const spas = getSpas(this);
      const spaFolderName = this.options.spaFolderName || (spas.length === 1 ? spas[0] : null);
      
      if (!spaFolderName && spas.length > 1) {
        this.log(yosay(chalk.red("SPA folder name is required when multiple SPAs are available!")));
        this.log(chalk.yellow(`Available SPAs: ${spas.join(', ')}`));
        process.exit(1);
        return;
      }

      this.answers = {
        sceneName: pascalCase(this.options.sceneName),
        spaFolderName: spaFolderName
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "generator-g-next"
          )} scene generator, follow the quick and easy configuration to create a new scene in  your SPA!`
        )
      );

      let answers = {};
      const spas = getSpas(this);
      if (spas.length > 1) {
        answers = await this.prompt([
          {
            type: "list",
            name: "spaFolderName",
            message: "In which SPA you want to create a scene?",
            choices: getSpas(this),
          },
        ]);
      } else {
        answers.spaFolderName = spas[0];
      }

      answers = {
        ...answers,
        ...(await this.prompt([
          {
            type: "input",
            name: "sceneName",
            message: "What is your scene name?",
          },
        ])),
      };

      if (answers.sceneName === "") {
        this.log(yosay(chalk.red("Please give your scene a name next time!")));
        process.exit(1);
        return;
      }

      answers.sceneName = pascalCase(answers.sceneName);
      this.answers = answers;
    }
  }

  writing() {
    const { sceneName, spaFolderName } = this.answers;

    // Index.tsx scene file
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(
        `./src/spas/${spaFolderName}/scenes/${sceneName}/index.tsx`
      ),
      {
        sceneName,
      }
    );

    // Index.hook.tsx scene file
    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(
        `./src/spas/${spaFolderName}/scenes/${sceneName}/index.hooks.tsx`
      ),
      {
        ...this.answers,
      }
    );

    // /scenes/index.tsx export file
    const content = `export * from './${this.answers.sceneName}';\n`;

    fs.appendFileSync(
      path.join(
        this.destinationRoot(),
        "src",
        "spas",
        spaFolderName,
        "scenes",
        "index.tsx"
      ),
      content
    );
  }
};
