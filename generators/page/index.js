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

    // Force overwrite if CLI options are provided (non-interactive mode)
    // Set it immediately after super() so Yeoman recognizes it
    const hasCliArgs = opts.pageName && opts.componentName && opts.renderingStrategy;
    if (hasCliArgs) {
      this.options.force = true;
    }
  }

  initializing() {
    // No-op: force is set in constructor

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

      // Get config for cookie auth
      const config = getGenygConfigFile(this);
      const availableCookieRoles = getAvailableCookieRoles(this);

      let answers = {};
      let validationErrors = [];

      // Prompt loop with validation
      let isValid = false;
      while (!isValid) {
        // Clear previous errors
        if (validationErrors.length > 0) {
          this.log(chalk.red("\nValidation errors:"));
          validationErrors.forEach((error) => {
            this.log(chalk.red(`  - ${error.message}`));
          });
          this.log("");
        }

        const promptAnswers = await this.prompt([
          {
            type: "directory",
            name: "pagePath",
            message: "Select where to create the page:",
            basePath: "./src/pages",
            validate: (input) => {
              if (!input || input.trim() === "" || input === "choose this directory") {
                return true; // Empty path is valid (root of pages)
              }
              const pathPattern = /^[a-zA-Z0-9\/\-]*$/;
              if (!pathPattern.test(input)) {
                return "Page path contains invalid characters. Only letters, numbers, slashes, and hyphens are allowed";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "pageName",
            message:
              "What is your page name? (Use squared brackets for single parameters - eg. [postId] -, double square brackets with trailing dots for multiple parameters - eg. [[...params]])",
            validate: (input) => {
              if (!input || input.trim() === "") {
                return "Page name is required";
              }
              const trimmed = input.trim();
              // Check if it's a dynamic route
              if (trimmed[0] === "[") {
                // Dynamic route - validate format
                if (trimmed[1] === "[") {
                  // Multiple parameters: [[...params]]
                  if (!trimmed.match(/^\[\[\.\.\.[a-zA-Z][a-zA-Z0-9]*\]\]$/)) {
                    return "Invalid multiple parameter format. Use [[...paramName]] where paramName starts with a letter";
                  }
                } else {
                  // Single parameter: [param]
                  if (!trimmed.match(/^\[[a-zA-Z][a-zA-Z0-9]*\]$/)) {
                    return "Invalid parameter format. Use [paramName] where paramName starts with a letter";
                  }
                }
              } else {
                // Static route - must start with a letter
                if (!/^[a-zA-Z]/.test(trimmed)) {
                  return "Page name must start with a letter";
                }
              }
              return true;
            },
          },
          {
            type: "input",
            name: "componentName",
            message: "What is your page component name?",
            validate: (input) => {
              if (!input || input.trim() === "") {
                return "Component name is required";
              }
              const trimmed = input.trim();
              if (!/^[a-zA-Z]/.test(trimmed)) {
                return "Component name must start with a letter";
              }
              return true;
            },
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

        // Normalize pagePath - handle "choose this directory" option
        let normalizedPagePath = promptAnswers.pagePath;
        if (normalizedPagePath === "choose this directory" || normalizedPagePath === "" || !normalizedPagePath) {
          normalizedPagePath = "";
        } else {
          normalizedPagePath = normalizedPagePath.trim();
        }

        // Validate with Yup schema
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
          }
        });

        const dataToValidate = {
          pageName: promptAnswers.pageName,
          componentName: promptAnswers.componentName,
          renderingStrategy: promptAnswers.renderingStrategy,
          pagePath: normalizedPagePath
        };

        try {
          await validationSchema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true
          });
          isValid = true;
          answers = {
            ...promptAnswers,
            pagePath: normalizedPagePath
          };
        } catch (error) {
          if (error.name === 'ValidationError') {
            validationErrors = error.inner.map(err => ({
              field: err.path,
              message: err.message,
              value: err.value
            }));
          } else {
            throw error;
          }
        }
      }

      // Cookie auth prompts
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
        } else {
          answers.cookieRole = null;
        }
      } else {
        answers.useCookieAuth = false;
        answers.cookieRole = null;
      }

      // Process page name for dynamic routes
      if (answers.pageName[0] === "[") {
        answers.dynamic = true;
        answers.multipleParameters = answers.pageName[1] === "[";
      } else {
        answers.dynamic = false;
        answers.multipleParameters = false;
      }

      // Normalize names
      answers.componentName = pascalCase(answers.componentName).trim();
      
      // Normalize pageName - preserve brackets and camelCase for dynamic routes
      if (answers.dynamic) {
        // For dynamic routes, preserve the bracket format and ensure parameter name is camelCase
        if (answers.multipleParameters) {
          // [[...params]] format - extract param name and normalize to camelCase
          const paramMatch = answers.pageName.match(/\[\[\.\.\.([a-zA-Z][a-zA-Z0-9]*)\]\]/);
          if (paramMatch) {
            const paramName = camelCase(paramMatch[1]);
            answers.pageName = `[[...${paramName}]]`;
          }
        } else {
          // [param] format - extract param name and normalize to camelCase
          const paramMatch = answers.pageName.match(/\[([a-zA-Z][a-zA-Z0-9]*)\]/);
          if (paramMatch) {
            const paramName = camelCase(paramMatch[1]);
            answers.pageName = `[${paramName}]`;
          }
        }
      } else {
        // For static routes, apply kebabCase normally
        answers.pageName = kebabCase(answers.pageName).trim();
      }
      
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
