"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  CartImageSnapshot,
  CartItem,
  CartMoney,
  CartProductSnapshot,
} from "../types/cart.types";

export const CART_STORAGE_NAME = "tienda-izipay-cart";
export const CART_STORAGE_VERSION = 1;

interface CartPersistedState {
  items: CartItem[];
}

export interface CartStore {
  items: CartItem[];
  hasHydrated: boolean;
  addItem: (product: CartProductSnapshot) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isCartMoney(value: unknown): value is CartMoney {
  return (
    isRecord(value) &&
    isNonNegativeSafeInteger(value.minorAmount) &&
    value.currency === "PEN"
  );
}

function isOptionalPositiveInteger(value: unknown): boolean {
  return value === undefined || isPositiveSafeInteger(value);
}

function isCartImage(value: unknown): value is CartImageSnapshot | null {
  if (value === null) {
    return true;
  }

  if (!isRecord(value)) {
    return false;
  }

  const desktopSrcIsValid =
    value.desktopSrc === null || typeof value.desktopSrc === "string";

  const mobileSrcIsValid =
    value.mobileSrc === undefined ||
    value.mobileSrc === null ||
    typeof value.mobileSrc === "string";

  return (
    desktopSrcIsValid &&
    mobileSrcIsValid &&
    isNonEmptyString(value.alt) &&
    isOptionalPositiveInteger(value.width) &&
    isOptionalPositiveInteger(value.height)
  );
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    isNonEmptyString(value.productId) &&
    isNonEmptyString(value.slug) &&
    isNonEmptyString(value.sku) &&
    isNonEmptyString(value.name) &&
    isCartMoney(value.unitPrice) &&
    isCartImage(value.image) &&
    isPositiveSafeInteger(value.quantity)
  );
}

export function sanitizePersistedCartState(value: unknown): CartPersistedState {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return {
      items: [],
    };
  }

  const uniqueItems = new Map<string, CartItem>();

  for (const item of value.items) {
    if (!isCartItem(item)) {
      continue;
    }

    if (!uniqueItems.has(item.productId)) {
      uniqueItems.set(item.productId, item);
    }
  }

  return {
    items: Array.from(uniqueItems.values()),
  };
}

export const selectCartUnitCount = (state: CartStore): number =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotalMinor = (state: CartStore): number =>
  state.items.reduce(
    (total, item) => total + item.unitPrice.minorAmount * item.quantity,
    0,
  );

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.productId,
          );

          if (!existing) {
            return {
              items: [
                ...state.items,
                {
                  ...product,
                  quantity: 1,
                },
              ],
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === product.productId
                ? {
                    ...item,
                    ...product,
                    quantity:
                      item.quantity < Number.MAX_SAFE_INTEGER
                        ? item.quantity + 1
                        : item.quantity,
                  }
                : item,
            ),
          };
        });
      },

      increment: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity < Number.MAX_SAFE_INTEGER
                      ? item.quantity + 1
                      : item.quantity,
                }
              : item,
          ),
        }));
      },

      decrement: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: Math.max(1, item.quantity - 1),
                }
              : item,
          ),
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      setHasHydrated: (hasHydrated) => {
        set({
          hasHydrated,
        });
      },
    }),
    {
      name: CART_STORAGE_NAME,
      version: CART_STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizePersistedCartState(persistedState),
      }),
      skipHydration: true,
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    },
  ),
);
