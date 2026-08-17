import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@a11y el carrito con producto no tiene violaciones serias o criticas", async ({
  page,
}) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.removeItem("tienda-izipay-cart");
  });

  await page.goto("/productos/camara-pro-4k");

  await page
    .getByRole("button", {
      name: "Agregar al carrito",
    })
    .click();

  await page.goto("/carrito");

  await expect(
    page.getByRole("heading", {
      name: "C\u00e1mara Pro 4K",
      level: 2,
    }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  const blockingViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});
