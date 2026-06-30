"use strict";
const Generator = require("../../common/yeoman-generator-base");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const { pascalCase } = require("pascal-case");
const { requirePackages } = require("../../common");
const {
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  commonSchemas,
} = require("../../common/cli-yup-helper");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Define CLI options
    this.option("modelName", {
      type: String,
      description: "Model name",
    });

    // Force overwrite if CLI options are provided (non-interactive mode)
    const hasCliArguments = opts.modelName;
    if (hasCliArguments) {
      this.options.force = true;
    }
  }

  initializing() {
    // No-op: force is set in constructor
  }

  async prompting() {
    // Config checks
    requirePackages(this, ["prisma"]);

    // Check if CLI options are provided
    const hasCliArguments = hasCliArgs(this.options, ["modelName"]);

    if (hasCliArguments) {
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)",
          )} Prisma model generator! Using CLI options for non-interactive generation.`,
        ),
      );

      const validationSchema = createValidationSchema({
        modelName: commonSchemas.name,
      });

      const validation = await validateCliArguments(
        this.options,
        this.options,
        this,
        validationSchema,
      );

      if (!validation.isValid) {
        displayValidationErrors(this, validation.errors);
        process.exit(1);
        return;
      }

      this.answers = {
        modelName: pascalCase(this.options.modelName).trim(),
      };
    } else {
      this.log(
        yosay(
          `Welcome to ${chalk.red(
            "Getapper NextJS Yeoman Generator (GeNYG)",
          )} Prisma model generator, follow the quick and easy configuration to create a new model!`,
        ),
      );

      const answers = await this.prompt([
        {
          type: "input",
          name: "modelName",
          message: "What is your model name?",
        },
      ]);

      if (answers.modelName === "") {
        this.log(yosay(chalk.red("Please give your model a name next time!")));
        process.exit(1);
        return;
      }

      answers.modelName = pascalCase(answers.modelName).trim();
      this.answers = answers;
    }
  }

  writing() {
    const { modelName } = this.answers;

    // Prisma delegate name = model name with a lowercase first letter
    const modelDelegate =
      modelName.charAt(0).toLowerCase() + modelName.slice(1);

    // 1) Append the model block to prisma/schema.prisma (if not present)
    const schemaPath = this.destinationPath("prisma/schema.prisma");
    let schema = "";
    try {
      schema = this.fs.read(schemaPath);
    } catch (e) {
      schema = "";
    }

    const modelRegex = new RegExp(`model\\s+${modelName}\\s*\\{`);
    if (!modelRegex.test(schema)) {
      const modelBlock = `model ${modelName} {
  id      String   @id @default(cuid())
  created DateTime @default(now())
  updated DateTime @updatedAt
  v       Int      @default(1)
}
`;
      const base = schema.trimEnd();
      this.fs.write(schemaPath, `${base}${base ? "\n\n" : ""}${modelBlock}`);
    } else {
      this.log(
        chalk.yellow(
          `model ${modelName} already exists in prisma/schema.prisma, leaving it untouched.`,
        ),
      );
    }

    // 2) Generate the server-side data-access class
    const relativeToModelsPath = `./src/models/server/${modelName}`;
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.join(relativeToModelsPath, "/index.ts")),
      {
        modelName,
        modelDelegate,
      },
    );

    this.log(
      yosay(
        `${chalk.green(`Model ${modelName} ready!`)}\n` +
          `Edit ${chalk.blue(
            "prisma/schema.prisma",
          )} to add fields, then run ${chalk.blue("npm run prisma:migrate")}.`,
      ),
    );
  }
};
