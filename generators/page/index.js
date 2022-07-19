"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const { requirePackages } = require("../../common");
const getPageTemplate = require("./templates");

module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory")
    );
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} page generator, follow the quick and easy configuration to create a new page!`
      )
    );

    let answers = await this.prompt([
      {
        type: "directory",
        name: "pagePath",
        message: "Select where to create the page:",
        basePath: "./pages",
      },
      {
        type: "input",
        name: "pageName",
        message:
          "What is your page name? (Use squared brackets for single parameters - eg. [postId] -, double square brackets with trailing dots for multiple parameters - eg. [[...params]])",
      },
    ]);

    if (answers.pageName[0] === "[") {
      answers.dynamic = true;
      answers.multipleParameters = answers.pageName[1] === "[";
      answers = {
        ...answers,
        ...(await this.prompt([
          {
            type: "input",
            name: "componentName",
            message: "What is your page component name?",
          },
        ])),
      };
    }

    answers = {
      ...answers,
      ...(await this.prompt([
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
      ])),
    };

    if (
      answers.pageName === "" ||
      (answers.dynamic && answers.componentName === "")
    ) {
      this.log(yosay(chalk.red("Please give your page a name next time!")));
      process.exit(1);
      return;
    }

    if (answers.dynamic) {
      answers.componentName = pascalCase(answers.componentName).trim();
    } else {
      answers.componentName = pascalCase(answers.pageName).trim();
    }
    this.answers = answers;
  }

  writing() {
    const {
      pagePath,
      pageName,
      dynamic,
      componentName,
      renderingStrategy,
      multipleParameters,
    } = this.answers;
    const folderName = dynamic
      ? pageName
      : kebabCase(pageName)
          .split("-")
          .filter((s) => s !== "")
          .join("-");

    const relativeToRootPath = `./pages/${
      pagePath ? pagePath + "/" : ""
    }${folderName}`;

    // Index.tsx page file
    this.fs.write(
      this.destinationPath(path.join(relativeToRootPath, "/index.tsx")),
      getPageTemplate(
        componentName,
        dynamic && renderingStrategy !== "Server-side Rendering Props (SSR)",
        renderingStrategy === "Static Generation Props (SSG)",
        renderingStrategy === "Server-side Rendering Props (SSR)",
        multipleParameters,
        multipleParameters ? null : pageName.replace("[", "").replace("]", "")
      )
    );
  }
};
