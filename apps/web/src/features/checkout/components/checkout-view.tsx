"use client";

import Link from "next/link";
import type { ReactElement } from "react";

import { useCartStore } from "@/features/cart/stores/cart.store";

import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";

export function CheckoutView(): ReactElement {
  const items = useCartStore((state) => state.items);

  const hasHydrated = useCartStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center text-sm text-[var(--color-text-muted)]"
      >
        Cargando checkout...
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
          Necesitas agregar al menos un producto antes de completar tus datos de
          checkout.
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
      <CheckoutForm />

      <CheckoutSummary items={items} />
    </div>
  );
}
