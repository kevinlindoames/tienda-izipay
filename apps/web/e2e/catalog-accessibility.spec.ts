import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("@a11y el catalogo no tiene violaciones serias o criticas", async ({
  page,
}) => {
  await page.goto("/productos");

  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});

test("@a11y la ficha de producto no tiene violaciones serias o criticas", async ({
  page,
}) => {
  await page.goto("/productos/camara-pro-4k");

  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});
