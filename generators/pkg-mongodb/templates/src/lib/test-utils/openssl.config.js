const path = require("path");

function setupOpenSSLForMongoMemoryServer() {
  if (process.platform === "linux") {
    const libPath = path.resolve(__dirname, "../openssl1.1");
    const existingPath = process.env.LD_LIBRARY_PATH;
    process.env.LD_LIBRARY_PATH = existingPath
      ? `${libPath}:${existingPath}`
      : libPath;
  }
}

module.exports = {
  setupOpenSSLForMongoMemoryServer,
};
