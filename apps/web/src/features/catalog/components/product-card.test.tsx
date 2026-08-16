import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Product } from "../types/catalog.types";
import { ProductCard } from "./product-card";

const product: Product = {
  id: "product-test",
  slug: "producto-test",
  sku: "TEST-001",
  name: "Producto Test",
  shortDescription: "Descripcion corta.",
  description: "Descripcion completa.",
  price: { minorAmount: 9990, currency: "PEN" },
  availability: "in-stock",
  active: true,
  featured: false,
  categorySlug: "accesorios",
  images: [
    {
      id: "product-test-image",
      desktopSrc: null,
      alt: "Imagen pendiente",
      position: 1,
      isPrimary: true,
    },
  ],
};

describe("ProductCard", () => {
  it("muestra datos esenciales y enlace al detalle", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Producto Test")).toBeInTheDocument();
    expect(screen.getByText("TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Disponible")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Ver producto" })).toHaveAttribute(
      "href",
      "/productos/producto-test",
    );
  });
});
