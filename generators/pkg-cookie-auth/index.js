var Generator = require("yeoman-generator");
const yosay = require("yosay");
const chalk = require("chalk");
const {
  requirePackages,
  getGenygConfigFile,
  extendConfigFile,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)",
        )}. ${chalk.red(
          "This command must be executed only once, and it will install all cookie-auth dependencies.",
        )}`,
      ),
    );

    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
      },
    ]);

    if (!this.answers.accept) {
      process.exit(0);
    }
  }

  writing() {
    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.cookieAuth) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG cookie-auth deps were already installed!",
          ),
        ),
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        "iron-session": "6.3.1",
      },
    });

    extendConfigFile(this, {
      packages: {
        cookieAuth: true,
      },
      cookieRoles: [],
    });

    this.fs.copy(this.templatePath(), this.destinationRoot());
  }
};
