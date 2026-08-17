"use client";

import Link from "next/link";
import type { ReactElement } from "react";

import {
  selectCartSubtotalMinor,
  selectCartUnitCount,
  useCartStore,
} from "../stores/cart.store";
import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartView(): ReactElement {
  const items = useCartStore((state) => state.items);

  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const unitCount = useCartStore(selectCartUnitCount);

  const subtotalMinor = useCartStore(selectCartSubtotalMinor);

  const clearCart = useCartStore((state) => state.clearCart);

  if (!hasHydrated) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center text-sm text-[var(--color-text-muted)]"
      >
        Cargando carrito...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          Tu carrito esta vacio
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
          Explora el catalogo y agrega productos para comenzar tu compra.
        </p>

        <Link
          href="/productos"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-dark)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-dark-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section aria-labelledby="cart-items-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2
              id="cart-items-title"
              className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]"
            >
              Productos
            </h2>

            <p
              aria-live="polite"
              className="mt-1 text-sm text-[var(--color-text-muted)]"
            >
              {unitCount} {unitCount === 1 ? "unidad" : "unidades"} en el
              carrito
            </p>
          </div>

          <button
            type="button"
            className="min-h-11 rounded-full px-4 text-sm font-medium text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
            onClick={() => {
              clearCart();
            }}
          >
            Vaciar carrito
          </button>
        </div>

        <div className="mt-3">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>
      </section>

      <CartSummary unitCount={unitCount} subtotalMinor={subtotalMinor} />
    </div>
  );
}
