import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "../stores/cart.store";
import type { CartItem } from "../types/cart.types";
import { CartView } from "./cart-view";

const item: CartItem = {
  productId: "product-camera-pro",
  slug: "camara-pro-4k",
  sku: "VID-001",
  name: "C\u00e1mara Pro 4K",
  unitPrice: {
    minorAmount: 129900,
    currency: "PEN",
  },
  image: null,
  quantity: 1,
};

describe("CartView", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
      hasHydrated: true,
    });
  });

  it("shows the empty cart state", () => {
    render(<CartView />);

    expect(
      screen.getByRole("heading", {
        name: "Tu carrito esta vacio",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Ver productos",
      }),
    ).toHaveAttribute("href", "/productos");
  });

  it("updates quantities and removes an item", async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      items: [item],
      hasHydrated: true,
    });

    render(<CartView />);

    expect(
      screen.getByRole("heading", {
        name: "C\u00e1mara Pro 4K",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Aumentar cantidad de C\u00e1mara Pro 4K",
      }),
    );

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);

    await user.click(
      screen.getByRole("button", {
        name: "Eliminar C\u00e1mara Pro 4K",
      }),
    );

    expect(useCartStore.getState().items).toEqual([]);
  });
});
