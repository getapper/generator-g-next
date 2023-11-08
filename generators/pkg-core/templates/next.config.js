/** @type {import('next').NextConfig} */
const options = require("./next.config.options.json");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return options.rewrites;
  },
  env: Object.fromEntries(
    options.env.map((envName) => [envName, process.env[envName]]),
  ),
};

module.exports = nextConfig;
