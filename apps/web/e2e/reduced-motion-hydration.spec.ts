import { expect, test } from "@playwright/test";

test("Reduced Motion no provoca hydration mismatch", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.emulateMedia({
    reducedMotion: "reduce",
  });

  await page.goto("/", {
    waitUntil: "networkidle",
  });

  const reducedMotionActive = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  expect(reducedMotionActive).toBe(true);

  await expect(
    page.getByRole("heading", {
      level: 1,
    }),
  ).toBeVisible();

  const hydrationMessages = consoleErrors.filter((message) => {
    const normalized = message.toLowerCase();

    return (
      normalized.includes("hydration") ||
      normalized.includes("hydrated") ||
      normalized.includes("didn't match") ||
      normalized.includes("did not match")
    );
  });

  expect(hydrationMessages).toEqual([]);
  expect(pageErrors).toEqual([]);
});
