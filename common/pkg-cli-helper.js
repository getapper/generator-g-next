"use strict";
const chalk = require("chalk");
const yosay = require("yosay");

const isPkgCliMode = (options) => Boolean(options.accept);

const configurePkgCliOptions = (generator, opts) => {
  generator.option("accept", {
    type: Boolean,
    description:
      "Accept installation without confirmation (non-interactive mode)",
    default: false,
  });

  if (opts.accept) {
    generator.options.force = true;
  }
};

const logPkgCliMode = (generator, packageLabel) => {
  generator.log(
    yosay(
      `Welcome to ${chalk.red(
        "Getapper NextJS Yeoman Generator (GeNYG)",
      )} ${packageLabel} generator! Using CLI options for non-interactive generation.`,
    ),
  );
};

const promptPkgAccept = async (generator, welcomeMessage, packageLabel) => {
  generator.log(yosay(welcomeMessage));

  if (isPkgCliMode(generator.options)) {
    logPkgCliMode(generator, packageLabel);
    generator.answers = { accept: true };
    return;
  }

  generator.answers = await generator.prompt([
    {
      type: "confirm",
      name: "accept",
      message: "Are you sure to proceed?",
    },
  ]);

  if (!generator.answers.accept) {
    process.exit(0);
  }
};

module.exports = {
  isPkgCliMode,
  configurePkgCliOptions,
  promptPkgAccept,
};
