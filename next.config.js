const pkg = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Injected at build time so the version badge never hardcodes a duplicate
  // of package.json's version string. Available as process.env.APP_VERSION
  // in both server and client code.
  env: {
    APP_VERSION: pkg.version,
  },
};

module.exports = nextConfig;
