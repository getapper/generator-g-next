"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const { requirePackages, getGenygConfigFile } = require("../../common");
const { generatePage } = require("../../common/file-generators");
const { camelCase } = require("camel-case");
const {
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  getAvailableCookieRoles,
  commonSchemas
} = require("../../common/cli-yup-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Define CLI options
    this.option('pageName', {
      type: String,
      description: 'Page name (use [param] for dynamic routes)'
    });

    this.option('componentName', {
      type: String,
      description: 'Page component name'
    });

    this.option('renderingStrategy', {
      type: String,
      description: 'Rendering strategy (none, Static Generation Props (SSG), Server-side Rendering Props (SSR))'
    });

    this.option('pagePath', {
      type: String,
      description: 'Page path (relative to src/pages)'
    });

    this.option('useCookieAuth', {
      type: Boolean,
      description: 'Use cookie authentication'
    });

    this.option('cookieRole', {
      type: String,
      description: 'Cookie role for authentication'
    });
  }

  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory"),
    );
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ['pageName', 'componentName', 'renderingStrategy']);
    
    if (hasCliArguments) {
      // Use CLI options directly
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)",
          )} page generator! Using CLI options for non-interactive generation.`,
        ),
      );

      // Get available cookie roles
      const availableCookieRoles = getAvailableCookieRoles(this);
      
      // Create validation schema
      const validationSchema = createValidationSchema({
        pageName: {
          required: true,
          requiredMessage: "Page name is required",
          minLength: 1,
          minLengthMessage: "Page name cannot be empty"
        },
        componentName: commonSchemas.name,
        renderingStrategy: commonSchemas.renderingStrategy,
        pagePath: {
          required: false,
          pattern: /^[a-zA-Z0-9\/\-]*$/,
          patternMessage: "Page path contains invalid characters. Only letters, numbers, slashes, and hyphens are allowed"
        },
        useCookieAuth: commonSchemas.useCookieAuth,
        cookieRole: {
          ...commonSchemas.cookieRole,
          oneOf: availableCookieRoles,
          oneOfMessage: `Cookie role must be one of: ${availableCookieRoles.join(', ')}`
        }
      });

      // Validate CLI options
      const validation = await validateCliArguments(this.options, this.options, this, validationSchema);
      
      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      // Process page name for dynamic routes
      const pageName = this.options.pageName;
      const dynamic = pageName[0] === "[";
      const multipleParameters = pageName[1] === "[";

      this.answers = {
        pageName: kebabCase(pageName).trim(),
        componentName: pascalCase(this.options.componentName).trim(),
        renderingStrategy: this.options.renderingStrategy,
        pagePath: this.options.pagePath || "",
        useCookieAuth: this.options.useCookieAuth || false,
        cookieRole: this.options.cookieRole || null,
        dynamic,
        multipleParameters
      };
    } else {
      // Interactive mode - show prompts
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)",
          )} page generator, follow the quick and easy configuration to create a new page!`,
        ),
      );

      let answers = await this.prompt([
        {
          type: "directory",
          name: "pagePath",
          message: "Select where to create the page:",
          basePath: "./src/pages",
        },
        {
          type: "input",
          name: "pageName",
          message:
            "What is your page name? (Use squared brackets for single parameters - eg. [postId] -, double square brackets with trailing dots for multiple parameters - eg. [[...params]])",
        },
        {
          type: "input",
          name: "componentName",
          message: "What is your page component name?",
        },
        {
          type: "list",
          name: "renderingStrategy",
          message: "Which function for rendering should be used?",
          choices: [
            "none",
            "Static Generation Props (SSG)",
            "Server-side Rendering Props (SSR)",
          ],
          default: "none",
        },
      ]);

      //cookie auth
      const config = getGenygConfigFile(this);
      if (
        config.packages.cookieAuth &&
        config.cookieRoles.length !== 0 &&
        answers.renderingStrategy === "Server-side Rendering Props (SSR)"
      ) {
        Object.assign(
          answers,
          await this.prompt([
            {
              type: "confirm",
              name: "useCookieAuth",
              message: "Do you want to use cookie authentication?",
              default: false,
            },
          ]),
        );
        if (answers.useCookieAuth) {
          Object.assign(
            answers,
            await this.prompt({
              type: "list",
              name: "cookieRole",
              message: "Select a role from the list",
              choices: config.cookieRoles,
            }),
          );
        }
      }

      if (answers.pageName[0] === "[") {
        answers.dynamic = true;
        answers.multipleParameters = answers.pageName[1] === "[";
      } else {
        answers.dynamic = false;
      }

      if (answers.pageName === "" || answers.componentName === "") {
        this.log(yosay(chalk.red("Please give your page a name next time!")));
        process.exit(1);
        return;
      }

      answers.componentName = pascalCase(answers.componentName).trim();
      answers.pageName = kebabCase(answers.pageName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const {
      pagePath,
      pageName,
      dynamic,
      componentName,
      renderingStrategy,
      multipleParameters,
      useCookieAuth,
      cookieRole,
    } = this.answers;
    const folderName = dynamic
      ? multipleParameters
        ? pageName
        : `[${camelCase(pageName.replace("[", "").replace("]", ""))}]`
      : pageName
          .split("-")
          .filter((s) => s !== "")
          .join("-");

    const relativeToRootPath = `./src/pages/${
      pagePath ? pagePath + "/" : ""
    }${folderName}`;

    // Index.tsx page file
    this.fs.write(
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      generatePage({
        componentName,
        useGetStaticPaths:
          dynamic && renderingStrategy !== "Server-side Rendering Props (SSR)",
        useGetStaticProps:
          renderingStrategy === "Static Generation Props (SSG)",
        userGetServerSideProps:
          renderingStrategy === "Server-side Rendering Props (SSR)",
        useCookieAuth,
        cookieRole: useCookieAuth ? camelCase(cookieRole) : "",
        dynamic,
        multipleParameters,
        paramName: multipleParameters
          ? pageName.replace("[[...", "").replace("]]", "")
          : camelCase(pageName.replace("[", "").replace("]", "")),
      }),
    );
  }
};
