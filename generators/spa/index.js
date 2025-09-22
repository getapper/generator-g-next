"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const {
  getGenygConfigFile,
  copyEjsTemplateFolder,
  requirePackages,
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
    this.option('spaName', {
      type: String,
      description: 'SPA name'
    });

    this.option('pageName', {
      type: String,
      description: 'Page name'
    });

    this.option('pagePath', {
      type: String,
      description: 'Page path (relative to src/pages)'
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
    requirePackages(this, ["spa"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['spaName', 'pageName']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} SPA generator! Using CLI options for non-interactive generation.`
        )
      );

      // Create validation schema
      const validationSchema = createValidationSchema({
        spaName: commonSchemas.name,
        pageName: commonSchemas.name,
        pagePath: {
          required: false,
          pattern: /^[a-zA-Z0-9\/\-]*$/,
          patternMessage: "Page path contains invalid characters. Only letters, numbers, slashes, and hyphens are allowed"
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
        spaName: pascalCase(this.options.spaName).trim(),
        pageName: pascalCase(this.options.pageName).trim(),
        pagePath: this.options.pagePath || ""
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)"
          )} SPA generator, follow the quick and easy configuration to create a new Single Page Application!`
        )
      );

      const answers = await this.prompt([
        {
          type: "input",
          name: "spaName",
          message: "What is your SPA name?",
        },
        {
          type: "directory",
          name: "pagePath",
          message: "Select where to create the page that will contain the SPA",
          basePath: "./src/pages",
        },
        {
          type: "input",
          name: "pageName",
          message: "What is your page name?",
        },
      ]);

      if (answers.pageName === "" || answers.spaName === "") {
        this.log(yosay(chalk.red("Please give your SPA a name next time!")));
        process.exit(1);
        return;
      }

      answers.pageName = pascalCase(answers.pageName).trim();
      answers.spaName = pascalCase(answers.spaName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { pagePath, pageName, spaName } = this.answers;

    const folderName = kebabCase(pageName)
      .split("-")
      .filter((s) => s !== "")
      .join("-");

    const spaFolderName = kebabCase(spaName)
      .split("-")
      .filter((s) => s !== "")
      .join("-");

    // Page files
    const basename = `/${pagePath ? pagePath + "/" : ""}${folderName}`;
    const relativeToRootPath = `./src/pages${basename}`;

    // Index.tsx page file
    this.fs.copyTpl(
      this.templatePath("page/index.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      {
        spaName,
        spaFolderName,
        pageName,
      }
    );

    // SPA files
    const relativeToSpaFolder = `./src/spas/${spaFolderName}/`;

    copyEjsTemplateFolder(
      this,
      this.templatePath("./spa"),
      relativeToSpaFolder,
      {
        spaName,
        spaFolderName,
        pageName,
        basename,
      }
    );

    const nextConfigOptionsJson = require(this.destinationPath(
      "next.config.options.json"
    ));
    this.fs.extendJSON(this.destinationPath("next.config.options.json"), {
      rewrites: [
        ...nextConfigOptionsJson.rewrites,
        {
          source: `${basename}/:path*`,
          destination: basename,
        },
      ],
    });
  }
};
