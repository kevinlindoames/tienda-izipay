import { beforeEach, describe, expect, it } from "vitest";

import type { CartProductSnapshot } from "../types/cart.types";
import {
  CART_STORAGE_NAME,
  CART_STORAGE_VERSION,
  selectCartSubtotalMinor,
  selectCartUnitCount,
  useCartStore,
} from "./cart.store";

const camera: CartProductSnapshot = {
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

describe("useCartStore", () => {
  beforeEach(() => {
    localStorage.clear();

    useCartStore.setState({
      items: [],
      hasHydrated: false,
    });
  });

  it("adds one item and increases an existing quantity", () => {
    useCartStore.getState().addItem(camera);
    useCartStore.getState().addItem(camera);

    expect(useCartStore.getState().items).toEqual([
      {
        ...camera,
        quantity: 2,
      },
    ]);

    expect(selectCartUnitCount(useCartStore.getState())).toBe(2);
    expect(selectCartSubtotalMinor(useCartStore.getState())).toBe(259800);
  });

  it("increments and never decrements below one", () => {
    useCartStore.getState().addItem(camera);

    useCartStore.getState().increment(camera.productId);

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);

    useCartStore.getState().decrement(camera.productId);
    useCartStore.getState().decrement(camera.productId);

    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("removes and clears items explicitly", () => {
    useCartStore.getState().addItem(camera);
    useCartStore.getState().removeItem(camera.productId);

    expect(useCartStore.getState().items).toEqual([]);

    useCartStore.getState().addItem(camera);
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("persists only items and not hydration state", () => {
    useCartStore.getState().addItem(camera);
    useCartStore.getState().setHasHydrated(true);

    const rawValue = localStorage.getItem(CART_STORAGE_NAME);

    expect(rawValue).not.toBeNull();

    const persisted = JSON.parse(rawValue ?? "{}") as {
      state?: Record<string, unknown>;
      version?: number;
    };

    expect(persisted.version).toBe(CART_STORAGE_VERSION);
    expect(persisted.state?.items).toHaveLength(1);
    expect(persisted.state).not.toHaveProperty("hasHydrated");
  });

  it("rejects malformed persisted cart items during hydration", async () => {
    localStorage.setItem(
      CART_STORAGE_NAME,
      JSON.stringify({
        version: CART_STORAGE_VERSION,
        state: {
          items: [
            {
              productId: "",
              slug: "invalido",
              sku: "BAD",
              name: "Invalido",
              unitPrice: {
                minorAmount: -1,
                currency: "PEN",
              },
              image: null,
              quantity: 0,
            },
            {
              ...camera,
              quantity: 2,
            },
          ],
        },
      }),
    );

    await useCartStore.persist.rehydrate();

    expect(useCartStore.getState().items).toEqual([
      {
        ...camera,
        quantity: 2,
      },
    ]);

    expect(useCartStore.getState().hasHydrated).toBe(true);
  });
});
