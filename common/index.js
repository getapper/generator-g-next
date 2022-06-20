const getGenygConfigFile = (genyg) => {
  return genyg.readDestinationJSON(".genyg.json");
};

module.exports = {
  getGenygConfigFile,
};
