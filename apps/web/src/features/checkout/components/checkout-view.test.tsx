import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "@/features/cart/stores/cart.store";
import type { CartItem } from "@/features/cart/types/cart.types";

import { CheckoutView } from "./checkout-view";

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
  quantity: 1,
};

describe("CheckoutView", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
      hasHydrated: true,
    });
  });

  it("blocks direct checkout when the cart is empty", () => {
    render(<CheckoutView />);

    expect(
      screen.getByRole("heading", {
        name: "Tu carrito esta vacio",
      }),
    ).toBeInTheDocument();
  });

  it("shows the form and summary when the cart has items", () => {
    useCartStore.setState({
      items: [item],
      hasHydrated: true,
    });

    render(<CheckoutView />);

    expect(
      screen.getByRole("group", {
        name: "Datos de contacto",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Resumen del carrito",
      }),
    ).toBeInTheDocument();
  });
});
