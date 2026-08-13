import { expect, test } from "@playwright/test";

test("Bloque B: la segunda mitad de la Home se renderiza completa", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Dise\u00f1ado para distintos espacios de trabajo",
    }),
  ).toBeVisible();

  await expect(page.locator("#use-cases article")).toHaveCount(2);

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Funcionalidad destacada",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("img", {
      name: "Gr\u00e1fico informativo destacado pendiente",
    }),
  ).toBeVisible();

  await expect(page.locator("#workflow")).toBeVisible();
  await expect(page.locator("#adaptability")).toBeVisible();
  await expect(page.locator("#design")).toBeVisible();

  await expect(page.locator("#compatibility article")).toHaveCount(4);
  await expect(page.locator("#contact")).toBeVisible();
  await expect(page.locator("#purchase")).toBeVisible();
});

test("Bloque B: navegacion secundaria alcanza compatibilidad", async ({
  page,
}) => {
  await page.goto("/");

  const navigation = page.getByRole("navigation", {
    name: "Navegacion del producto",
  });

  await navigation.getByRole("link", { name: "Compatibilidad" }).click();

  await expect(page).toHaveURL(/#compatibility$/);
  await expect(page.locator("#compatibility")).toBeInViewport();
});

test("Bloque B: CTA comerciales tienen destinos existentes en la pagina", async ({
  page,
}) => {
  await page.goto("/");

  const productNav = page.getByRole("navigation", {
    name: "Navegacion del producto",
  });

  await expect(
    productNav.getByRole("link", {
      name: "Comprar",
      exact: true,
    }),
  ).toHaveCount(0);

  const buyAction = page.getByRole("link", {
    name: "Comprar",
    exact: true,
  });

  await expect(buyAction).toBeVisible();
  await expect(buyAction).toHaveAttribute("href", "#purchase");

  await expect(page.locator("#purchase")).toHaveCount(1);
  await expect(page.locator("#contact")).toHaveCount(1);
});

test("Bloque B: CTA principal sigue visible a 320px sin overflow global", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 320,
    height: 800,
  });

  await page.goto("/");

  const buyAction = page.getByRole("link", {
    name: "Comprar",
    exact: true,
  });

  await expect(buyAction).toBeVisible();
  await expect(buyAction).toHaveAttribute("href", "#purchase");

  const hasHorizontalOverflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });

  expect(hasHorizontalOverflow).toBe(false);
});

test("Bloque B: footer no usa enlaces hash vacios", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('footer a[href="#"]')).toHaveCount(0);

  const futureRoutes = page.locator('footer a[href^="/"]');

  expect(await futureRoutes.count()).toBeGreaterThan(0);
});

test("Bloque B: la Home completa no tiene overflow horizontal", async ({
  page,
}) => {
  await page.goto("/");

  const hasHorizontalOverflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });

  expect(hasHorizontalOverflow).toBe(false);
});
