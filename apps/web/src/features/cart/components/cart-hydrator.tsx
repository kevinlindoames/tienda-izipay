"use client";

import { useEffect, type ReactElement } from "react";

import { useCartStore } from "../stores/cart.store";

export function CartHydrator(): ReactElement | null {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
