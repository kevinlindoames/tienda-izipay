import { describe, expect, it } from "vitest";

import type { Product } from "@/features/catalog/types/catalog.types";

import { toCartProductSnapshot } from "./cart-product";

const product: Product = {
  id: "product-camera-pro",
  slug: "camara-pro-4k",
  sku: "VID-001",
  name: "C\u00e1mara Pro 4K",
  shortDescription: "Descripcion corta.",
  description: "Descripcion completa.",
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
      id: "image-camera",
      desktopSrc: "https://picsum.photos/seed/camera/900/900",
      mobileSrc: "https://picsum.photos/seed/camera/700/700",
      alt: "Camara",
      width: 900,
      height: 900,
      position: 0,
      isPrimary: true,
    },
  ],
};

describe("toCartProductSnapshot", () => {
  it("keeps only the minimum cart snapshot", () => {
    expect(toCartProductSnapshot(product)).toEqual({
      productId: "product-camera-pro",
      slug: "camara-pro-4k",
      sku: "VID-001",
      name: "C\u00e1mara Pro 4K",
      unitPrice: {
        minorAmount: 129900,
        currency: "PEN",
      },
      image: {
        desktopSrc: "https://picsum.photos/seed/camera/900/900",
        mobileSrc: "https://picsum.photos/seed/camera/700/700",
        alt: "Camara",
        width: 900,
        height: 900,
      },
    });
  });
});
