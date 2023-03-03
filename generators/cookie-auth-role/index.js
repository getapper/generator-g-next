"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const kebabCase = require("kebab-case");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  requirePackages,
  extendConfigFile,
  extendEnv,
} = require("../../common");
const { camelCase } = require("camel-case");
const { snakeCase } = require("snake-case");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const generateLibSessionFile = ({
  cookieRoles,
  projectName,
}) => `// this file is a wrapper with defaults to be used in both API routes and \`getServerSideProps\` functions
import type { IronSessionOptions } from "iron-session";

${cookieRoles
  .map(
    (cookieRole) =>
      `import { ${pascalCase(
        cookieRole,
      )}Session } from "@/models/server/${pascalCase(cookieRole)}Session";`,
  )
  .join("\n")}

${cookieRoles
  .map(
    (cookieRole) => `
export const ${camelCase(cookieRole)}SessionOptions: IronSessionOptions = {
  password: process.env.${snakeCase(
    cookieRole,
  ).toUpperCase()}_SECRET_COOKIE_PASSWORD as string,
  cookieName: "${projectName.toLowerCase()}-${kebabCase(
      cookieRole,
    )}-cookie-auth",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};`,
  )
  .join("\n")}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
${cookieRoles
  .map(
    (cookieRole) =>
      `    ${camelCase(cookieRole)}?: ${pascalCase(cookieRole)}Session;`,
  )
  .join("\n")}
  }
}
`;

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["cookieAuth"]);

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next",
        )} cookie-role generator, follow the quick and easy configuration to create a new authentication role!`,
      ),
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "roleNames",
        message:
          'what role do you want to add?(you can add several roles at once separated by "," e.g.: admin,user)\n',
      },
    ]);

    if (answers.roleNames === "") {
      this.log(yosay(chalk.red("Please give your role a name next time!")));
      process.exit(1);
      return;
    }

    answers.roleNames = answers.roleNames
      .split(",")
      .map((role) => kebabCase(role.trim().split(" ").join("-").toLowerCase()));
    this.answers = answers;
  }

  writing() {
    const { roleNames } = this.answers;
    const config = getGenygConfigFile(this);
    const cookieRoles = config.cookieRoles;

    //Index.ts model file
    roleNames.forEach((cookieRole) => {
      if (!cookieRoles.includes(cookieRole)) {
        cookieRoles.push(cookieRole);
        this.fs.copyTpl(
          this.templatePath("index.ejs"),
          this.destinationPath(
            `./src/models/server/${pascalCase(cookieRole)}Session/index.ts`,
          ),
          {
            cookieRole: pascalCase(cookieRole),
          },
        );
        //extent env.template
        extendEnv(
          this,
          "template",
          `${snakeCase(cookieRole).toUpperCase()}_SECRET_COOKIE_PASSWORD=12345678901234567890123456789012`
        )
      }
    });

    extendConfigFile(this, {
      cookieRoles,
    });

    //Index.tsx session file
    this.fs.write(
      this.destinationPath("./src/lib/session/index.tsx"),
      generateLibSessionFile({
        cookieRoles,
        projectName: require(this.destinationPath("./package.json")).name,
      }),
    );
  }
};
