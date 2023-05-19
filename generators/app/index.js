"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  install() {
    this.spawnCommand("npx", [
      "create-next-app@13.2.3",
      ".",
      "--ts",
      "--use-npm",
      "--eslint",
      "--src-dir",
      "--import-alias",
      "@/*",
      "--no-experimental-app",
      "--no-tailwind",
    ]).on("exit", () => {
      this.spawnCommand("npm", ["i", "next@13.2.3", "-S", "-E"]);
      this.spawnCommand("npm", ["i", "eslint-config-next@13.2.3", "-S", "-E"]);
      this.spawnCommand("npm", ["i", "typescript@4.9.5", "-S", "-E"]);
    });
  }
};
