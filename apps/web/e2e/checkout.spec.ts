import { expect, test, type Page } from "@playwright/test";

async function clearBrowserCart(page: Page): Promise<void> {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.removeItem("tienda-izipay-cart");
  });
}

async function addCameraToCart(page: Page): Promise<void> {
  await page.goto("/productos/camara-pro-4k");

  await page
    .getByRole("button", {
      name: "Agregar al carrito",
    })
    .click();
}

test("bloquea checkout directo con carrito vacio", async ({ page }) => {
  await clearBrowserCart(page);

  await page.goto("/checkout");

  await expect(
    page.getByRole("heading", {
      name: "Checkout",
      level: 1,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Tu carrito esta vacio",
    }),
  ).toBeVisible();
});

test("completa y valida un checkout de envio sin persistir PII", async ({
  page,
}) => {
  await clearBrowserCart(page);
  await addCameraToCart(page);

  await page.goto("/carrito");

  await page
    .getByRole("link", {
      name: "Continuar al checkout",
    })
    .click();

  await expect(page).toHaveURL(/\/checkout$/);

  await page
    .getByRole("button", {
      name: "Revisar pedido",
    })
    .click();

  await expect(page.getByText("Ingresa tus nombres.")).toBeVisible();

  await page.getByLabel("Nombres").fill("Kevin");

  await page.getByLabel("Apellidos").fill("Lindo");

  await page.getByLabel("Correo electronico").fill("kevin@example.com");

  await page.getByLabel("Telefono").fill("987654321");

  await page.getByLabel("Departamento").fill("Lima");

  await page.getByLabel("Provincia").fill("Lima");

  await page.getByLabel("Distrito").fill("Miraflores");

  await page.getByLabel("Direccion").fill("Av. Demo 123");

  await page
    .getByRole("button", {
      name: "Revisar pedido",
    })
    .click();

  await expect(page.getByText("Datos listos para revisar")).toBeVisible();

  const checkoutStorageKeys = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) =>
      key.toLowerCase().includes("checkout"),
    ),
  );

  expect(checkoutStorageKeys).toEqual([]);
});

test("pickup funciona en viewport movil sin exigir direccion", async ({
  page,
}) => {
  await page.setViewportSize({
    width: 375,
    height: 812,
  });

  await clearBrowserCart(page);
  await addCameraToCart(page);

  await page.goto("/checkout");

  await page.getByLabel("Nombres").fill("Kevin");

  await page.getByLabel("Apellidos").fill("Lindo");

  await page.getByLabel("Correo electronico").fill("kevin@example.com");

  await page.getByLabel("Telefono").fill("987654321");

  await page.getByLabel("Modalidad de entrega").selectOption("pickup");

  await expect(page.getByLabel("Departamento")).toHaveCount(0);

  await page
    .getByRole("button", {
      name: "Revisar pedido",
    })
    .click();

  await expect(page.getByText("Datos listos para revisar")).toBeVisible();
});
