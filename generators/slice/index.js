"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { pascalCase } = require("pascal-case");
const {
  getGenygConfigFile,
  getSpas,
  requirePackages,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["spa"]);

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-next"
        )} redux slice generator, follow the quick and easy configuration to create a new slice!`
      )
    );

    let answers = {};
    const spas = getSpas(this);
    if (spas.length > 1) {
      answers = await this.prompt([
        {
          type: "list",
          name: "spaFolderName",
          message: "In which SPA you want to create a scene?",
          choices: getSpas(this),
        },
      ]);
    } else {
      answers.spaFolderName = spas[0];
    }

    answers = {
      ...answers,
      ...(await this.prompt([
        {
          type: "input",
          name: "sliceName",
          message: "What is your slice name?",
        },
        {
          type: "confirm",
          name: "useSagas",
          message: "Would you like to create a saga file?",
          default: true,
        },
      ])),
    };

    if (answers.sliceName === "") {
      this.log(yosay(chalk.red("Please give your slice a name next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }

  writing() {
    const { useSagas, sliceName, spaFolderName } = this.answers;
    const pCsliceName = pascalCase(sliceName);
    const reduxStorePath = `./src/spas/${spaFolderName}/redux-store`;

    /**
     * Slice/index.tsx file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(
        `./src/spas/${spaFolderName}/redux-store/slices/${sliceName}/index.ts`
      ),
      {
        sliceName,
        pCsliceName,
        useSagas,
      }
    );

    // Slice/interface/index.tsx file
    this.fs.copyTpl(
      this.templatePath("interface.index.ejs"),
      this.destinationPath(
        `${reduxStorePath}/slices/${sliceName}/${sliceName}.interfaces.ts`
      ),
      {
        pCsliceName,
      }
    );

    //Slice/selectors/index.tsx file
    this.fs.copyTpl(
      this.templatePath("selectors.index.ejs"),
      this.destinationPath(
        `${reduxStorePath}/slices/${sliceName}/${sliceName}.selectors.ts`
      ),
      {
        sliceName,
        pCsliceName,
        spaFolderName,
      }
    );

    // Slice/sagas/index.tsx file
    if (useSagas) {
      this.fs.copyTpl(
        this.templatePath("sagas.index.ejs"),
        this.destinationPath(
          `${reduxStorePath}/slices/${sliceName}/${sliceName}.sagas.ts`
        ),
        {
          sliceName,
        }
      );
    }

    let slicesIndex = this.fs.read(
      this.destinationPath(`${reduxStorePath}/slices/index.ts`)
    );

    let match = slicesIndex.match(/import(.*?);\n\n/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}import * as ${sliceName} from "./${sliceName}";

`
    );
    match = slicesIndex.match(/(.*)Store(.*?).reducer,?\n}/)[0];
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
    if (useSagas) {
      match = slicesIndex.match(/(.*)Object.values(.*),?\n]/)[0];
      slicesIndex = slicesIndex.replace(
        match,
        `${match.slice(0, -1)}  ...Object.values(${sliceName}.sagas),
]`
      );
    }

    this.fs.write(
      this.destinationPath(`${reduxStorePath}/slices/index.ts`),
      slicesIndex
    );
  }
};
