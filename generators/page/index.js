"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const { requirePackages, getGenygConfigFile} = require("../../common");
const getPageTemplate = require("./templates");
const {camelCase} = require("camel-case");

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
    if (config.packages.cookieAuth &&
      config.cookieRoles.length !== 0 &&
      answers.renderingStrategy === "Server-side Rendering Props (SSR)") {
      Object.assign(
        answers,
        await this.prompt([
          {
            type: "confirm",
            name: "useCookieAuth",
            message: "Do you want to use cookie authentication?",
            default: false,
          },
        ])
      );
      if (answers.useCookieAuth) {
        Object.assign(
          answers,
          await this.prompt({
            type: "list",
            name: "cookieRole",
            message: "Select a role from the list",
            choices: config.cookieRoles,
          })
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
      ? pageName
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
      getPageTemplate({
        componentName,
        useGetStaticPaths:
          dynamic && renderingStrategy !== "Server-side Rendering Props (SSR)",
        useGetStaticProps:
          renderingStrategy === "Static Generation Props (SSG)",
        userGetServerSideProps:
          renderingStrategy === "Server-side Rendering Props (SSR)",
        useCookieAuth,
        cookieRole:
          pascalCase(cookieRole),
        dynamic,
        multipleParameters,
        paramName: multipleParameters
          ? pageName.replace("[[...", "").replace("]]", "")
          : pageName.replace("[", "").replace("]", ""),
      })
    );
  }
};
