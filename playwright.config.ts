import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;
const storybookUrl = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1";
const appCommand =
  process.env.PLAYWRIGHT_APP_COMMAND ??
  `pnpm dev --host 127.0.0.1 --port ${PORT}`;
const storybookCommand =
  process.env.PLAYWRIGHT_STORYBOOK_COMMAND ??
  "pnpm storybook --ci --port 6006";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      grepInvert: /@performance/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      grepInvert: /@performance/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "desktop-performance",
      grep: /@performance/,
      workers: 1,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-performance",
      grep: /@performance/,
      workers: 1,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: skipWebServer
    ? undefined
    : [
        {
          command: appCommand,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: storybookCommand,
          url: storybookUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      ],
});
