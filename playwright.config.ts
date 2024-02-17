import { defineConfig } from "@playwright/test";

const baseUrl = "http://localhost:4321/ekiden/";

export default defineConfig({
  testDir: "tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: process.env.CI ? 5 * 60 * 1000 : 0,

  reporter: "html",

  use: {
    baseURL: baseUrl,

    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm run dev",
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
