import { expect, test } from "@playwright/test";

test("Bloque A: la parte superior de la Home se renderiza completa", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Una experiencia amplia, clara y profesional",
    }),
  ).toBeVisible();

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#features article")).toHaveCount(8);

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Caracter\u00edsticas principales",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("img", {
      name: "Imagen principal pendiente de entrega",
    }),
  ).toBeVisible();
});

test("Bloque A: la subnav navega a caracteristicas", async ({ page }) => {
  await page.goto("/");

  const productNavigation = page.getByRole("navigation", {
    name: "Navegacion del producto",
  });

  await productNavigation
    .getByRole("link", { name: "Caracter\u00edsticas" })
    .click();

  await expect(page).toHaveURL(/#features$/);
  await expect(page.locator("#features")).toBeInViewport();
});

test("Bloque A: no existe overflow horizontal del documento", async ({
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

test("Bloque A: el menu movil abre, navega y cierra", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");

  await page.goto("/");

  const openButton = page.getByRole("button", {
    name: "Abrir menu",
  });

  await expect(openButton).toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");

  await openButton.click();

  const closeButton = page.getByRole("button", {
    name: "Cerrar menu",
  });

  await expect(closeButton).toHaveAttribute("aria-expanded", "true");

  const mobileNavigation = page.getByRole("navigation", {
    name: "Navegacion movil",
  });

  await expect(mobileNavigation).toBeVisible();

  await mobileNavigation.getByRole("link", { name: "Productos" }).click();

  await expect(page).toHaveURL(/#features$/);
  await expect(
    page.getByRole("button", { name: "Abrir menu" }),
  ).toHaveAttribute("aria-expanded", "false");
});
