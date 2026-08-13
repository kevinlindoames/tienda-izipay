import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@a11y la Home no tiene violaciones serias o criticas", async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: "reduce",
  });

  await page.goto("/");

  const reducedMotionActive = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  expect(reducedMotionActive).toBe(true);

  await expect(page.locator("body")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  const blockingViolations = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );

  expect(blockingViolations).toEqual([]);
});
