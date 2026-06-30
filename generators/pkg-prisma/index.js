"use strict";
const Generator = require("../../common/yeoman-generator-base");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
  extendEnv,
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
        "This command must be executed only once, and it will install Prisma and set up a PostgreSQL (Neon-ready) datasource.",
      )}`,
      "pkg-prisma",
    );
  }

  writing() {
    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.prisma) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG Prisma deps were already installed!",
          ),
        ),
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        "@prisma/client": "^6.2.1",
      },
      devDependencies: {
        prisma: "^6.2.1",
      },
    });

    // Environment variables
    // DATABASE_URL  -> pooled connection used by the app at runtime
    // DIRECT_URL    -> direct connection used by Prisma Migrate
    extendEnv(
      this,
      "local",
      `# Prisma + Neon Postgres
# Pooled connection (use the -pooler host from Neon) for the app runtime
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require
# Direct connection (no -pooler) used by Prisma Migrate
DIRECT_URL=postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/DBNAME?sslmode=require`,
    );
    extendEnv(
      this,
      "test",
      `# Prisma + Neon Postgres (test branch/database)
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DBNAME-test?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/DBNAME-test?sslmode=require`,
    );
    extendEnv(
      this,
      "template",
      `# Prisma + Neon Postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/DBNAME?sslmode=require`,
    );
    // Prisma CLI reads the root .env by default for migrations
    extendEnv(
      this,
      "",
      `# Prisma CLI (migrations) reads this file by default.
# Keep it in sync with your environment-specific .env.local values.
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/DBNAME?sslmode=require`,
    );

    // Copy Prisma schema + client singleton (prisma/ and src/lib/prisma/)
    this.fs.copy(this.templatePath(), this.destinationRoot());

    // Add Prisma scripts to package.json
    this.packageJson.merge({
      scripts: {
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:deploy": "prisma migrate deploy",
        "prisma:push": "prisma db push",
        "prisma:studio": "prisma studio",
      },
    });

    // Make sure DATABASE_URL/DIRECT_URL are exposed through next config options
    const nextConfigOptionsPath = this.destinationPath(
      "next.config.options.json",
    );
    if (this.fs.exists(nextConfigOptionsPath)) {
      const nextConfigOptionsJson = this.fs.readJSON(nextConfigOptionsPath, {});
      this.fs.extendJSON(nextConfigOptionsPath, {
        env: [
          ...(nextConfigOptionsJson?.env ?? []),
          "DATABASE_URL",
          "DIRECT_URL",
        ],
      });
    }

    extendConfigFile(this, {
      packages: {
        prisma: true,
      },
    });

    this.log(
      yosay(
        `${chalk.green("Prisma installed!")} Next steps:\n` +
          `1) npm install\n` +
          `2) fill DATABASE_URL / DIRECT_URL in your .env files (Neon)\n` +
          `3) create a model: ${chalk.blue("yo g-next:model-prisma --modelName Task")}\n` +
          `4) run a migration: ${chalk.blue("npm run prisma:migrate")}`,
      ),
    );
  }
};
