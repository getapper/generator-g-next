"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const kebabCase = require("kebab-case");
const { getGenygConfigFile, copyEjsTemplateFolder } = require("../../common");

module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt(
      "directory",
      require("inquirer-directory")
    );
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "Getapper NextJS Yeoman Generator (GeNYG)"
        )} SPA generator, follow the quick and easy configuration to create a new Single Page Application!`
      )
    );

    // Config checks
    const configFile = getGenygConfigFile(this);
    if (!configFile.packages.spa) {
      this.log(
        yosay(
          chalk.red(
            "You need SPA package installed in order to create a SPA. Run yo g-next:pkg-spa to fix this."
          )
        )
      );
      process.exit(0);
    }

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
        basePath: "./pages",
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
    const relativeToRootPath = `./pages${basename}`;

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

    // Index.hooks.tsx hooks file
    this.fs.copyTpl(
      this.templatePath("page/index.hooks.ejs"),
      this.destinationPath(path.join(relativeToRootPath, "/index.hooks.tsx")),
      {
        spaName,
        spaFolderName,
        pageName,
      }
    );

    // SPA files
    const relativeToSpaFolder = `./spas/${spaFolderName}/`;

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
