import { expect, test } from "@playwright/test";

const isolatedApiBaseUrl = "http://127.0.0.1:3101/api/v1";

test("starts the isolated API and protected admin application", async ({
  page,
  request,
}) => {
  const healthResponse = await request.get(`${isolatedApiBaseUrl}/health`);

  expect(healthResponse.ok()).toBe(true);
  expect(await healthResponse.json()).toEqual({
    service: "api",
    status: "ok",
  });

  await page.goto("/admin/productos");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", {
      name: /iniciar sesión/i,
    }),
  ).toBeVisible();
});
