const { withSentryConfig } = require("@sentry/nextjs");
const pkg = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    instrumentationHook: true,
  },
  // Injected at build time so the version badge never hardcodes a duplicate
  // of package.json's version string. Available as process.env.APP_VERSION
  // in both server and client code.
  env: {
    APP_VERSION: pkg.version,
  },
};

// Wraps the config to upload source maps to Sentry on build. No-ops without
// SENTRY_AUTH_TOKEN (e.g. local dev, or before the project is configured).
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: false,
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
