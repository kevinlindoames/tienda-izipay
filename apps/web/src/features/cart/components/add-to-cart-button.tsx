"use client";

import { useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";

import { useCartStore } from "../stores/cart.store";
import type { CartProductSnapshot } from "../types/cart.types";

interface AddToCartButtonProps {
  product: CartProductSnapshot;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps): ReactElement {
  const addItem = useCartStore((state) => state.addItem);
  const [feedbackCount, setFeedbackCount] = useState(0);

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => {
          addItem(product);
          setFeedbackCount((value) => value + 1);
        }}
      >
        {disabled ? "Producto agotado" : "Agregar al carrito"}
      </Button>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {feedbackCount > 0 ? `${product.name} agregado al carrito.` : ""}
      </p>
    </>
  );
}
