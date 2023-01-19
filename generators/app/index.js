"use strict";
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  install() {
    this.spawnCommand("npx", ["create-next-app@12", ".", "--ts", "--use-npm"]);
  }
};
