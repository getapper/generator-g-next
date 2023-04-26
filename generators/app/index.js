"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  install() {
    this.spawnCommand("npx", [
      "create-next-app",
      ".",
      "--ts",
      "--use-npm",
      "--eslint",
      "--src-dir",
      "--import-alias",
      "@/*",
      "--no-experimental-app",
      "--no-tailwind",
    ]);
  }
};
