const getGenygConfigFile = (genyg) => {
  return genyg.readDestinationJSON(".genyg.json");
};

const extendConfigFile = (genyg, json) => {
  genyg.fs.extendJSON(genyg.destinationPath(".genyg.json"), json);
};

module.exports = {
  getGenygConfigFile,
  extendConfigFile,
};
