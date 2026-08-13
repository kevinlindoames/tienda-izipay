import { expect, test } from "@playwright/test";

const widths = [320, 375, 430, 768, 1024, 1440, 1920] as const;

test("Bloque C: responsive completo 320 a 1920 sin overflow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");

  for (const width of widths) {
    await page.setViewportSize({
      width,
      height: 900,
    });

    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);

    await expect(
      page.getByRole("link", {
        name: "Comprar",
        exact: true,
      }),
    ).toBeVisible();

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(
      layout.scrollWidth,
      `overflow horizontal a ${width}px`,
    ).toBeLessThanOrEqual(layout.clientWidth);
  }
});

test("Bloque C: jerarquia de headings no salta niveles", async ({ page }) => {
  await page.goto("/");

  const levels = await page
    .locator("h1, h2, h3, h4, h5, h6")
    .evaluateAll((headings) =>
      headings.map((heading) => Number(heading.tagName.substring(1))),
    );

  expect(levels[0]).toBe(1);
  expect(levels.filter((level) => level === 1)).toHaveLength(1);

  for (let index = 1; index < levels.length; index += 1) {
    expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
  }
});

test("Bloque C: imagenes y placeholders tienen texto alternativo", async ({
  page,
}) => {
  await page.goto("/");

  const invalidImages = await page.evaluate(() => {
    const nativeImages = Array.from(document.querySelectorAll("img")).filter(
      (image) => !(image.getAttribute("alt") ?? "").trim(),
    );

    const roleImages = Array.from(
      document.querySelectorAll('[role="img"]'),
    ).filter((image) => !(image.getAttribute("aria-label") ?? "").trim());

    return nativeImages.length + roleImages.length;
  });

  expect(invalidImages).toBe(0);
});

test("Bloque C: menu movil funciona con teclado y Escape", async ({ page }) => {
  await page.setViewportSize({
    width: 320,
    height: 800,
  });

  await page.goto("/");

  const trigger = page.getByRole("button", {
    name: "Abrir menu",
  });

  await trigger.focus();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");

  const mobileNavigation = page.getByRole("navigation", {
    name: "Navegacion movil",
  });

  await expect(mobileNavigation).toBeVisible();

  await page.keyboard.press("Tab");

  await expect(
    mobileNavigation.getByRole("link", {
      name: "Productos",
    }),
  ).toBeFocused();

  await page.keyboard.press("Escape");

  await expect(
    page.getByRole("button", {
      name: "Abrir menu",
    }),
  ).toBeFocused();

  await expect(mobileNavigation).not.toBeVisible();
});

test("Bloque C: focus visible y area tactil de botones", async ({ page }) => {
  await page.setViewportSize({
    width: 320,
    height: 800,
  });

  await page.goto("/");

  const trigger = page.getByRole("button", {
    name: "Abrir menu",
  });

  await trigger.focus();

  const focusStyle = await trigger.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
    };
  });

  expect(
    focusStyle.boxShadow !== "none" || focusStyle.outlineStyle !== "none",
  ).toBe(true);

  const buttonHeights = await page
    .locator("button")
    .evaluateAll((buttons) =>
      buttons.map((button) => button.getBoundingClientRect().height),
    );

  for (const height of buttonHeights) {
    expect(height).toBeGreaterThanOrEqual(44);
  }
});

test("Bloque C: Home no genera errores de consola o pagina", async ({
  page,
}) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  expect(errors).toEqual([]);
});

test("Bloque C: ruta inexistente usa not-found y responde 404", async ({
  page,
}) => {
  const response = await page.goto("/ruta-inexistente-cierre-home");

  expect(response?.status()).toBe(404);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "P\u00e1gina no encontrada",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Volver al inicio",
    }),
  ).toHaveAttribute("href", "/");
});
