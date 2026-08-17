"use client";

import Link from "next/link";
import type { ReactElement } from "react";

import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { formatMoney } from "@/features/catalog/utils/format-money";

import { useCartStore } from "../stores/cart.store";
import type { CartItem } from "../types/cart.types";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps): ReactElement {
  const increment = useCartStore((state) => state.increment);

  const decrement = useCartStore((state) => state.decrement);

  const removeItem = useCartStore((state) => state.removeItem);

  const lineTotal = {
    minorAmount: item.unitPrice.minorAmount * item.quantity,
    currency: item.unitPrice.currency,
  } as const;

  return (
    <article className="flex flex-col gap-5 border-b border-[var(--color-border)] py-6 sm:flex-row">
      <div className="w-full shrink-0 sm:w-28">
        <ResponsiveMedia
          desktopSrc={item.image?.desktopSrc ?? null}
          mobileSrc={item.image?.mobileSrc}
          alt={item.image?.alt ?? `Imagen pendiente de ${item.name}`}
          sizes="112px"
          className="aspect-square"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {item.sku}
            </p>

            <h2 className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              <Link
                href={`/productos/${item.slug}`}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              >
                {item.name}
              </Link>
            </h2>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {formatMoney(item.unitPrice)} por unidad
            </p>
          </div>

          <p className="text-base font-semibold text-[var(--color-text)]">
            {formatMoney(lineTotal)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
            aria-label={`Cantidad de ${item.name}`}
          >
            <button
              type="button"
              disabled={item.quantity <= 1}
              aria-label={`Disminuir cantidad de ${item.name}`}
              className="inline-flex size-11 items-center justify-center rounded-l-full text-lg text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                decrement(item.productId);
              }}
            >
              -
            </button>

            <span
              aria-live="polite"
              className="min-w-10 text-center text-sm font-semibold text-[var(--color-text)]"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              aria-label={`Aumentar cantidad de ${item.name}`}
              className="inline-flex size-11 items-center justify-center rounded-r-full text-lg text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              onClick={() => {
                increment(item.productId);
              }}
            >
              +
            </button>
          </div>

          <button
            type="button"
            aria-label={`Eliminar ${item.name}`}
            className="min-h-11 rounded-full px-4 text-sm font-medium text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
            onClick={() => {
              removeItem(item.productId);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
