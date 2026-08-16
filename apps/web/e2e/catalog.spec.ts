import { expect, test } from "@playwright/test";

test("el catalogo carga, filtra y navega al detalle", async ({ page }) => {
  await page.goto("/productos");

  await expect(
    page.getByRole("heading", { name: "Productos", level: 1 }),
  ).toBeVisible();

  await expect(page.getByText("8 productos")).toBeVisible();

  await page.getByLabel("Categoria").selectOption("audio");
  await page.getByRole("button", { name: "Aplicar" }).click();

  await expect(page).toHaveURL(/category=audio/);
  await expect(page.getByText("2 productos")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Micrófono USB Studio" }),
  ).toBeVisible();

  await page.goto("/productos/camara-pro-4k");

  await expect(
    page.getByRole("heading", { name: "Cámara Pro 4K", level: 1 }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "Agregar al carrito — disponible en el siguiente bloque",
    }),
  ).toBeDisabled();
});

test("el catalogo soporta busqueda sin resultados", async ({ page }) => {
  await page.goto("/productos?q=producto-que-no-existe");

  await expect(
    page.getByRole("heading", { name: "No encontramos productos" }),
  ).toBeVisible();
});

test("un slug inexistente muestra not-found y evita indexacion", async ({
  page,
}) => {
  await page.goto("/productos/no-existe");

  await expect(
    page.getByRole("heading", { name: "Producto no encontrado" }),
  ).toBeVisible();

  const noIndexMeta = page.locator('meta[name="robots"][content*="noindex"]');

  await expect(noIndexMeta.first()).toHaveAttribute("content", /noindex/);
});
