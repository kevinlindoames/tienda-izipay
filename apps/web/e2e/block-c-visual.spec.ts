import { expect, test } from "@playwright/test";

const visualWidths = [375, 768, 1024, 1440] as const;

test("Bloque C: capturas visuales de referencia", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");

  for (const width of visualWidths) {
    await page.setViewportSize({
      width,
      height: 900,
    });

    await page.goto("/");

    await expect(page.locator("footer")).toBeVisible();

    const screenshot = await page.screenshot({
      fullPage: true,
    });

    await testInfo.attach(`home-${width}px`, {
      body: screenshot,
      contentType: "image/png",
    });
  }
});
