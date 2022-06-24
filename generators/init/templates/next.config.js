/** @type {import('next').NextConfig} */
const options = require("./next.config.options.json");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return options.rewrites;
  },
};

module.exports = nextConfig;
