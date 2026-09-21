import { defineConfig, devices } from "@playwright/test";

const runIdPattern = /^[a-z0-9][a-z0-9_]{5,47}$/;
const schemaPattern = /^e2e_[a-z0-9_]+$/;
const localApiBaseUrl = "http://127.0.0.1:3101/api/v1";
const localWebBaseUrl = "http://127.0.0.1:3100";

function inheritedEnvironment(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      "The mutable Playwright suite must be started by its guarded API wrapper.",
    );
  }

  return value;
}

if (
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_E2E ||
  process.env.E2E_ADMIN_PASSWORD
) {
  throw new Error(
    "Database credentials must not enter the Playwright or Next.js process.",
  );
}

if (
  process.env.E2E_MUTABLE !== "1" ||
  process.env.NODE_ENV !== "test" ||
  process.env.PLAYWRIGHT_TEST !== "1"
) {
  throw new Error(
    "The mutable Playwright suite requires its guarded execution context.",
  );
}

const runId = requiredEnvironment("E2E_RUN_ID");
const schema = requiredEnvironment("E2E_SCHEMA");

if (
  !runIdPattern.test(runId) ||
  !schemaPattern.test(schema) ||
  schema !== `e2e_${runId}` ||
  schema === "public"
) {
  throw new Error("The mutable Playwright schema context is invalid.");
}

process.env.API_BASE_URL = localApiBaseUrl;

export default defineConfig({
  testDir: "./e2e/admin-products",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: localWebBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      name: "api-e2e",
      command:
        "pnpm -C ../.. build:api && pnpm -C ../.. --filter api e2e:mutable:start-api",
      env: {
        ...inheritedEnvironment(),
        E2E_MUTABLE: "1",
        E2E_PROJECT_REF: requiredEnvironment("E2E_PROJECT_REF"),
        E2E_RUN_ID: runId,
        E2E_SCHEMA: schema,
        NODE_ENV: "test",
        PLAYWRIGHT_TEST: "1",
        PORT: "3101",
      },
      url: `${localApiBaseUrl}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      name: "web-e2e",
      command: "pnpm build && pnpm start",
      env: {
        ...inheritedEnvironment(),
        API_BASE_URL: localApiBaseUrl,
        NODE_ENV: "production",
        PLAYWRIGHT_TEST: "1",
        PORT: "3100",
      },
      url: localWebBaseUrl,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
