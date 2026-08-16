import { describe, expect, it } from "vitest";

import { catalogRepository } from "./catalog.repository";

describe("catalogRepository", () => {
  it("filtra productos por categoria", async () => {
    const result = await catalogRepository.list({
      q: "",
      category: "audio",
      sort: "featured",
      page: 1,
      pageSize: 20,
    });

    expect(result.products).toHaveLength(2);
    expect(
      result.products.every((product) => product.categorySlug === "audio"),
    ).toBe(true);
  });

  it("busca ignorando mayusculas y tildes", async () => {
    const result = await catalogRepository.list({
      q: "camara",
      category: "",
      sort: "featured",
      page: 1,
      pageSize: 20,
    });

    expect(result.products.map((product) => product.slug)).toEqual(
      expect.arrayContaining(["camara-pro-4k", "camara-compacta-hd"]),
    );
  });

  it("ordena por precio ascendente", async () => {
    const result = await catalogRepository.list({
      q: "",
      category: "",
      sort: "price-asc",
      page: 1,
      pageSize: 20,
    });

    const prices = result.products.map((product) => product.price.minorAmount);

    expect(prices).toEqual([...prices].sort((left, right) => left - right));
  });

  it("pagina resultados sin salir del rango", async () => {
    const result = await catalogRepository.list({
      q: "",
      category: "",
      sort: "featured",
      page: 99,
      pageSize: 6,
    });

    expect(result.page).toBe(result.totalPages);
    expect(result.totalPages).toBe(2);
    expect(result.products).toHaveLength(2);
  });

  it("obtiene producto por slug", async () => {
    await expect(
      catalogRepository.getBySlug("camara-pro-4k"),
    ).resolves.toMatchObject({
      sku: "VID-001",
      name: "Cámara Pro 4K",
    });
  });
});
