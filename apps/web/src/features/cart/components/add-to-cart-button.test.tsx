import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "../stores/cart.store";
import type { CartProductSnapshot } from "../types/cart.types";
import { AddToCartButton } from "./add-to-cart-button";

const product: CartProductSnapshot = {
  productId: "product-camera-pro",
  slug: "camara-pro-4k",
  sku: "VID-001",
  name: "C\u00e1mara Pro 4K",
  unitPrice: {
    minorAmount: 129900,
    currency: "PEN",
  },
  image: null,
};

describe("AddToCartButton", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
      hasHydrated: true,
    });
  });

  it("adds the product to the Zustand cart", async () => {
    const user = userEvent.setup();

    render(<AddToCartButton product={product} />);

    await user.click(
      screen.getByRole("button", {
        name: "Agregar al carrito",
      }),
    );

    expect(useCartStore.getState().items).toEqual([
      {
        ...product,
        quantity: 1,
      },
    ]);

    expect(
      screen.getByText("C\u00e1mara Pro 4K agregado al carrito."),
    ).toBeInTheDocument();
  });

  it("does not allow adding an out-of-stock product", async () => {
    const user = userEvent.setup();

    render(<AddToCartButton product={product} disabled />);

    const button = screen.getByRole("button", {
      name: "Producto agotado",
    });

    expect(button).toBeDisabled();

    await user.click(button);

    expect(useCartStore.getState().items).toEqual([]);
  });
});
