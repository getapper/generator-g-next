const fs = require("fs");

const getGenygConfigFile = (genyg) => {
  return genyg.readDestinationJSON(".genyg.json");
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
  return fs.readdirSync(genyg.destinationPath("./spas"));
};

module.exports = {
  getGenygConfigFile,
  extendConfigFile,
  copyEjsTemplateFolder,
  getSpas,
};
