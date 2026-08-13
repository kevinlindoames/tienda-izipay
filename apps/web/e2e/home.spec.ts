import { expect, test } from "@playwright/test";

test("la Home carga sin error", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).toBeVisible();
});
