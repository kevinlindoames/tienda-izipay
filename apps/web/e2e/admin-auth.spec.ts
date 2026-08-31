import { expect, test } from "@playwright/test";

const protectedAdminRoutes = [
  "/admin",
  "/admin/productos",
  "/admin/inventario",
  "/admin/pedidos",
] as const;

for (const route of protectedAdminRoutes) {
  test(`${route} redirects unauthenticated visitors to login`, async ({
    page,
  }) => {
    await page.goto(route);

    await expect(page).toHaveURL(/\/admin\/login$/);

    await expect(
      page.getByRole("heading", {
        name: /iniciar sesión/i,
      }),
    ).toBeVisible();
  });
}

test("admin login remains outside the protected shell", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(
    page.getByRole("heading", {
      name: /iniciar sesión/i,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("navigation", {
      name: "Navegación administrativa",
    }),
  ).toHaveCount(0);
});
