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
  // Security headers applied to every response. These are the "safe" set that
  // never breaks the app: they don't restrict script/style sources (a full
  // Content-Security-Policy with a nonce is a separate follow-up). frame-ancestors
  // 'none' is the modern anti-clickjacking control; X-Frame-Options is the legacy
  // fallback for old browsers.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
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
