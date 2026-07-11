import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Serial: tests share one dev-server process (in-memory rate limits) and
  // one Postgres instance — parallel runs were flaky under that shared
  // state. The suite is small enough that this costs little.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // This repo's @playwright/test version doesn't always match the
        // browser build pre-installed in CI/sandbox images (which ships
        // under PLAYWRIGHT_BROWSERS_PATH). Point at it explicitly instead
        // of letting Playwright look for its own pinned build, which may
        // not have been downloaded (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1).
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: {
    // A production build, not `next dev` — dev mode compiles each route on
    // first hit, which was slow enough on a cold server to blow past this
    // suite's navigation timeouts and land on false failures. CI already
    // runs `npm run build` as its own step before this, so it only starts.
    command: process.env.CI ? "npm run start" : "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
