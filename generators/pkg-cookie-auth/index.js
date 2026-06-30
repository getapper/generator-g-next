var Generator = require("../../common/yeoman-generator-base");
const yosay = require("yosay");
const chalk = require("chalk");
const {
  requirePackages,
  getGenygConfigFile,
  extendConfigFile,
} = require("../../common");
const {
  configurePkgCliOptions,
  promptPkgAccept,
} = require("../../common/pkg-cli-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    configurePkgCliOptions(this, opts);
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    await promptPkgAccept(
      this,
      `Hi! Welcome to the official ${chalk.blue(
        "Getapper NextJS Yeoman Generator (GeNYG)",
      )}. ${chalk.red(
        "This command must be executed only once, and it will install all cookie-auth dependencies.",
      )}`,
      "pkg-cookie-auth",
    );
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
