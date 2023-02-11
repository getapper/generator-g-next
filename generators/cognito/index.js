"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  getSpas,
  requirePackages,
  copyEjsTemplateFolder,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["cognito"]);

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} cognito generator, follow the quick and easy configuration to add cognito to your SPA!`
      )
    );

    const answers = await this.prompt([
      {
        type: "list",
        name: "spaFolderName",
        message: "In which SPA you want to create a slice?",
        choices: getSpas(this),
      },
    ]);

    this.answers = answers;
  }

  writing() {
    const { spaFolderName } = this.answers;
    const relativeToSpaFolder = `./src/spas/${spaFolderName}`;
    const reduxStorePath = `./src/spas/${spaFolderName}/redux-store`;
    const sliceName = "cognito";

    copyEjsTemplateFolder(this, this.templatePath("."), relativeToSpaFolder, {
      spaFolderName,
    });

    let slicesIndex = this.fs.read(
      this.destinationPath(`${reduxStorePath}/slices/index.ts`)
    );

    let match = slicesIndex.match(/import(.*?);\n\n/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}import * as ${sliceName} from "./${sliceName}";

`
    );
    match = slicesIndex.match(/(.*):(.*)Store(.*?).reducer,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(
        0,
        -1
      )}  ${sliceName}: ${sliceName}.${sliceName}Store.reducer,
}`
    );
    match = slicesIndex.match(/(.*)Store(.*?).actions,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}  ...${sliceName}.${sliceName}Store.actions,
}`
    );
    match = slicesIndex.match(/(.*).selectors,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}  ...${sliceName}.selectors,
}`
    );
    match = slicesIndex.match(/(.*)Object.values(.*),?\n]/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}  ...Object.values(${sliceName}.sagas),
]`
    );

    this.fs.write(
      this.destinationPath(`${reduxStorePath}/slices/index.ts`),
      slicesIndex
    );
  }
};
