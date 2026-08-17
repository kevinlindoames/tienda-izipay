import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CartItem } from "@/features/cart/types/cart.types";

import { CheckoutSummary } from "./checkout-summary";

const item: CartItem = {
  productId: "product-camera-pro",
  slug: "camara-pro-4k",
  sku: "VID-001",
  name: "Camara Pro 4K",
  unitPrice: {
    minorAmount: 129900,
    currency: "PEN",
  },
  image: null,
  quantity: 2,
};

describe("CheckoutSummary", () => {
  it("shows items, units and a referential subtotal", () => {
    render(<CheckoutSummary items={[item]} />);

    expect(
      screen.getByRole("heading", {
        name: "Resumen del carrito",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Camara Pro 4K")).toBeInTheDocument();

    expect(screen.getByText("Subtotal referencial")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Volver al carrito",
      }),
    ).toHaveAttribute("href", "/carrito");
  });
});
