"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { selectCartUnitCount, useCartStore } from "../stores/cart.store";

export function CartIndicator(): ReactElement {
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const unitCount = useCartStore(selectCartUnitCount);

  const displayedCount = hasHydrated ? unitCount : 0;

  const unitLabel = displayedCount === 1 ? "unidad" : "unidades";

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito, ${displayedCount} ${unitLabel}`}
      className="relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
    >
      <ShoppingBag aria-hidden="true" className="size-5" />

      <span className="hidden lg:inline">Carrito</span>

      {hasHydrated && unitCount > 0 ? (
        <span
          aria-hidden="true"
          className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--color-dark)] px-1.5 text-xs font-semibold leading-5 text-white"
        >
          {unitCount}
        </span>
      ) : null}
    </Link>
  );
}
