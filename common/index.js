const fs = require("fs");
const yosay = require("yosay");
const chalk = require("chalk");

const getGenygConfigFile = (genyg) => {
  return genyg.readDestinationJSON(".genyg.json");
};

const requirePackages = (genyg, pkgs) => {
  const configFile = genyg.readDestinationJSON(".genyg.json");
  for (let pkg of pkgs) {
    if (!configFile.packages[pkg]) {
      genyg.log(
        yosay(
          chalk.red(
            `You need ${pkg} package installed in order to run this command. Run yo g-next:pkg-${pkg} to fix this.`
          )
        )
      );
      process.exit(0);
      return;
    }
  }
};

const extendConfigFile = (genyg, json) => {
  genyg.fs.extendJSON(genyg.destinationPath(".genyg.json"), json);
};

const copyEjsTemplateFolder = (genyg, srcFolder, destFolder, params) => {
  const entries = fs.readdirSync(srcFolder);
  for (const fOrDName of entries) {
    const fOrDPath = `${srcFolder}/${fOrDName}`;
    if (fs.existsSync(fOrDPath) && fs.lstatSync(fOrDPath).isDirectory()) {
      copyEjsTemplateFolder(
        genyg,
        fOrDPath,
        `${destFolder}/${fOrDName}`,
        params
      );
    } else {
      genyg.fs.copyTpl(fOrDPath, `${destFolder}/${fOrDName}`, params);
    }
  }
};

const getSpas = (genyg) => {
  return fs.readdirSync(genyg.destinationPath("./src/spas"));
};

const extendEnv = (genyg, envName, newContent) => {
  let envFileContent = "";
  try {
    envFileContent = genyg.fs.read(
      genyg.destinationPath(`.env${envName ? "." + envName : ""}`)
    );
  } catch (e) {}
  genyg.fs.write(
    genyg.destinationPath(`.env${envName ? "." + envName : ""}`),
    `${envFileContent}
${newContent}`
  );
};

const checkPackageInstalled = (genyg, pkg) => {
  const configFile = genyg.readDestinationJSON(".genyg.json");
  return configFile.packages[pkg];
};

const checkGenygVersion = (genyg) => {};

module.exports = {
  getGenygConfigFile,
  requirePackages,
  extendConfigFile,
  copyEjsTemplateFolder,
  getSpas,
  extendEnv,
  checkPackageInstalled,
};
