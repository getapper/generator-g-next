"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  requirePackages,
  extendConfigFile,
} = require("../../common");
const getSessionTemplate = require("./templates");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["cookieAuth"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} cookie-role generator, follow the quick and easy configuration to create a new authentication role!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "roleName",
        message:
          'what role do you want to add?(you can add several roles at once separated by "," e.g.: admin,user)\n',
      },
    ]);

    if (answers.roleName === "") {
      this.log(yosay(chalk.red("Please give your role a name next time!")));
      process.exit(1);
      return;
    }

    answers.roleName = answers.roleName.split(",").map((role) => {
      return pascalCase(role.trim());
    });
    this.answers = answers;
  }

  writing() {
    const { roleName } = this.answers;
    const configfile = getGenygConfigFile(this);
    const roles = configfile.cookieRoles;
    roles.push(...roleName);

    extendConfigFile(this, {
      cookieRoles: roles,
    });

    //Index.ts model file
    roleName.forEach((role) => {
      this.fs.copyTpl(
        this.templatePath("index.ejs"),
        this.destinationPath(`./src/models/server/${role}/index.ts`),
        {
          role,
        }
      );
    });

    //Index.tsx session file
    this.fs.write(
      this.destinationPath("./src/lib/session/index.tsx"),
      getSessionTemplate({
        roles,
        projectName: require(this.destinationPath("./package.json")).name,
      })
    );
  }
};
