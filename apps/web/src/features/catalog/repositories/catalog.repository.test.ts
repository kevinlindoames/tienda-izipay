import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/api-client.server", () => {
  class MockApiHttpError extends Error {
    constructor(
      public readonly status: number,
      public readonly path: string,
    ) {
      super(`HTTP ${status}`);
      this.name = "ApiHttpError";
    }
  }

  return {
    ApiHttpError: MockApiHttpError,
    apiGet: vi.fn(),
  };
});

import { ApiHttpError, apiGet } from "@/lib/api/api-client.server";

import type { CatalogCategory, Product } from "../types/catalog.types";
import { catalogRepository } from "./catalog.repository";

const apiGetMock = vi.mocked(apiGet);

const cameraProduct: Product = {
  id: "product-camera-pro",
  slug: "camara-pro-4k",
  sku: "VID-001",
  name: "Cámara Pro 4K",
  shortDescription: "Descripción corta.",
  description: "Descripción completa.",
  price: {
    minorAmount: 129900,
    currency: "PEN",
  },
  compareAtPrice: {
    minorAmount: 149900,
    currency: "PEN",
  },
  availability: "in-stock",
  active: true,
  featured: true,
  categorySlug: "video",
  images: [
    {
      id: "catalog-image-1",
      desktopSrc: "https://picsum.photos/seed/camera-pro-4k/900/900",
      mobileSrc: "https://picsum.photos/seed/camera-pro-4k/700/700",
      alt: "Cámara Pro 4K",
      position: 1,
      isPrimary: true,
    },
  ],
};

const videoCategory: CatalogCategory = {
  id: "category-video",
  slug: "video",
  name: "Video",
  description: "Cámaras y soluciones visuales.",
};

describe("catalogRepository API", () => {
  beforeEach(() => {
    apiGetMock.mockReset();
  });

  it("translates catalog filters to the NestJS API", async () => {
    apiGetMock.mockImplementation(async (path) => {
      if (path.startsWith("/products?")) {
        return {
          products: [cameraProduct],
          pagination: {
            total: 1,
            page: 2,
            limit: 6,
            totalPages: 2,
          },
        };
      }

      if (path === "/categories") {
        return {
          categories: [videoCategory],
        };
      }

      throw new Error(`Unexpected path: ${path}`);
    });

    const result = await catalogRepository.list({
      q: " camara ",
      category: "video",
      sort: "price-asc",
      page: 2,
      pageSize: 6,
    });

    expect(apiGetMock).toHaveBeenNthCalledWith(
      1,
      "/products?q=camara&category=video&sort=price-asc&page=2&limit=6",
    );

    expect(apiGetMock).toHaveBeenNthCalledWith(2, "/categories");

    expect(result).toEqual({
      products: [cameraProduct],
      categories: [videoCategory],
      total: 1,
      page: 2,
      pageSize: 6,
      totalPages: 2,
    });
  });

  it("gets one product from the API by slug", async () => {
    apiGetMock.mockResolvedValue({
      product: cameraProduct,
    });

    await expect(
      catalogRepository.getBySlug(" CAMARA-PRO-4K "),
    ).resolves.toEqual(cameraProduct);

    expect(apiGetMock).toHaveBeenCalledWith("/products/camara-pro-4k");
  });

  it("maps a backend 404 to null", async () => {
    apiGetMock.mockRejectedValue(new ApiHttpError(404, "/products/no-existe"));

    await expect(catalogRepository.getBySlug("no-existe")).resolves.toBeNull();
  });

  it("does not hide non-404 backend errors", async () => {
    apiGetMock.mockRejectedValue(
      new ApiHttpError(503, "/products/camara-pro-4k"),
    );

    await expect(
      catalogRepository.getBySlug("camara-pro-4k"),
    ).rejects.toMatchObject({
      status: 503,
    });
  });

  it("rejects an invalid API contract", async () => {
    apiGetMock.mockImplementation(async (path) => {
      if (path === "/categories") {
        return {
          categories: [],
        };
      }

      return {
        products: "invalid",
        pagination: {},
      };
    });

    await expect(
      catalogRepository.list({
        q: "",
        category: "",
        sort: "featured",
        page: 1,
        pageSize: 6,
      }),
    ).rejects.toThrow("invalid product-list contract");
  });
});
