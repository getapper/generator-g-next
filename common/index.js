const fs = require("fs");
const yosay = require("yosay");
const chalk = require("chalk");

const getGenygConfigFile = (genyg) => {
  let raw;
  try {
    raw = genyg.readDestinationJSON(".genyg.json");
  } catch {
    raw = undefined;
  }
  if (!raw || typeof raw !== "object") {
    return { packages: {}, cookieRoles: [] };
  }
  return {
    ...raw,
    packages:
      raw.packages && typeof raw.packages === "object" ? raw.packages : {},
    cookieRoles: Array.isArray(raw.cookieRoles) ? raw.cookieRoles : [],
  };
};

const requirePackages = (genyg, pkgs) => {
  const configFile = getGenygConfigFile(genyg);
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
  const configFile = getGenygConfigFile(genyg);
  return Boolean(configFile.packages[pkg]);
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
