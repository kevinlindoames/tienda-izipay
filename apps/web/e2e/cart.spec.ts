import { expect, test, type Page } from "@playwright/test";

async function clearBrowserCart(page: Page): Promise<void> {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.removeItem("tienda-izipay-cart");
  });
}

test("agrega, modifica, persiste y elimina productos del carrito", async ({
  page,
}) => {
  await clearBrowserCart(page);

  await page.goto("/productos/camara-pro-4k");

  await page
    .getByRole("button", {
      name: "Agregar al carrito",
    })
    .click();

  await expect(
    page.getByRole("link", {
      name: "Carrito, 1 unidad",
    }),
  ).toBeVisible();

  await page
    .getByRole("link", {
      name: "Carrito, 1 unidad",
    })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Carrito",
      level: 1,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "C\u00e1mara Pro 4K",
      level: 2,
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "Aumentar cantidad de C\u00e1mara Pro 4K",
    })
    .click();

  await expect(
    page.getByRole("link", {
      name: "Carrito, 2 unidades",
    }),
  ).toBeVisible();

  await expect(page.getByText("2 unidades en el carrito")).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("link", {
      name: "Carrito, 2 unidades",
    }),
  ).toBeVisible();

  await expect(page.getByText("2 unidades en el carrito")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Disminuir cantidad de C\u00e1mara Pro 4K",
    })
    .click();

  await expect(
    page.getByRole("link", {
      name: "Carrito, 1 unidad",
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "Eliminar C\u00e1mara Pro 4K",
    })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Tu carrito esta vacio",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Carrito, 0 unidades",
    }),
  ).toBeVisible();
});

test("bloquea agotados y permite productos con poco stock", async ({
  page,
}) => {
  await clearBrowserCart(page);

  await page.goto("/productos/speaker-conference");

  await expect(
    page.getByRole("button", {
      name: "Producto agotado",
    }),
  ).toBeDisabled();

  await page.goto("/productos/camara-compacta-hd");

  await expect(
    page.getByRole("button", {
      name: "Agregar al carrito",
    }),
  ).toBeEnabled();
});
