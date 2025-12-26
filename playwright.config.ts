import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for WikiTrivia E2E tests.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  
  // Global timeout for each test
  timeout: 60 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 15 * 1000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    // Default to 3000, override with PLAYWRIGHT_BASE_URL if needed
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    
    // Collect trace when retrying the failed test
    trace: "on-first-retry",
    
    // Screenshot on failure
    screenshot: "only-on-failure",
    
    // Video on failure
    video: "on-first-retry",
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Uncomment to test on more browsers:
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    // },
  ],

  // Run your local dev server before starting the tests
  // Set PLAYWRIGHT_SKIP_WEBSERVER=true to skip starting the dev server
  // (useful when the server is already running)
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});

