"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
  extendEnv,
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
          "This command must be executed only once, and it will install all MongoDB dependencies.",
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
    if (configFile.packages.mongodb) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG MongoDB deps were already installed!",
          ),
        ),
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        mongodb: "4.4.0",
      },
      devDependencies: {
        "mongodb-memory-server": "^8.16.1",
      },
    });

    //Environment variables
    extendEnv(
      this,
      "local",
      `MONGODB_NAME=*
MONGODB_URI=mongodb://127.0.0.1:27017/$MONGODB_NAME`,
    );
    extendEnv(
      this,
      "test",
      `MONGODB_NAME=*-test
MONGODB_URI=mongodb://127.0.0.1:27017/$MONGODB_NAME`,
    );
    extendEnv(
      this,
      "template",
      `MONGODB_NAME=*
MONGODB_URI=mongodb://127.0.0.1:27017/$MONGODB_NAME`,
    );

    // Copy MongoDB lib files
    this.fs.copy(this.templatePath(), this.destinationRoot());

    // Copy database export/import tasks
    this.fs.copy(
      this.templatePath("src/tasks/export-database"),
      this.destinationPath("src/tasks/export-database"),
    );
    this.fs.copy(
      this.templatePath("src/tasks/import-database"),
      this.destinationPath("src/tasks/import-database"),
    );

    // Add task scripts to package.json
    this.packageJson.merge({
      scripts: {
        "TASK:ExportDatabase": "ts-node --project tsconfig-ts-node.json -r tsconfig-paths/register src/tasks/export-database/exec",
        "TASK:ImportDatabase": "ts-node --project tsconfig-ts-node.json -r tsconfig-paths/register src/tasks/import-database/exec",
      },
    });

    // Add .db-exports to .gitignore if not already present
    const gitignorePath = this.destinationPath(".gitignore");
    if (this.fs.exists(gitignorePath)) {
      const gitignoreContent = this.fs.read(gitignorePath);
      if (!gitignoreContent.includes(".db-exports")) {
        const updatedGitignore = `${gitignoreContent}\n.db-exports`;
        this.fs.write(gitignorePath, updatedGitignore);
      }
    }

    const nextConfigOptionsJson = require(this.destinationPath(
      "next.config.options.json",
    ));
    this.fs.extendJSON(this.destinationPath("next.config.options.json"), {
      env: [
        ...(nextConfigOptionsJson?.env ?? []),
        "MONGODB_NAME",
        "MONGODB_URI",
      ],
    });

    // Update jest.config.js to add forceExit for MongoDB Memory Server cleanup
    const jestConfigPath = this.destinationPath("jest.config.js");
    if (this.fs.exists(jestConfigPath)) {
      const jestConfig = this.fs.read(jestConfigPath);
      // Add forceExit if not already present
      if (!jestConfig.includes("forceExit")) {
        const updatedConfig = jestConfig.replace(
          /(\s+setupFilesAfterEnv:.*),/,
          `$1,\n  // Force exit after tests complete to handle MongoDB Memory Server cleanup\n  // The MongoDB driver's internal monitoring timers may keep Jest from exiting\n  // even after all connections are properly closed\n  forceExit: true,`,
        );
        this.fs.write(jestConfigPath, updatedConfig);
      }
    }

    extendConfigFile(this, {
      packages: {
        mongodb: true,
      },
    });
  }
};
