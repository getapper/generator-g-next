"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  install() {
    this.spawnCommand("npx", [
      "create-next-app@latest",
      "--ts"
    ]);
  }
};
