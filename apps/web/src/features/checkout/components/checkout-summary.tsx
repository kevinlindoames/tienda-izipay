import Link from "next/link";
import type { ReactElement } from "react";

import { formatMoney } from "@/features/catalog/utils/format-money";
import type { CartItem } from "@/features/cart/types/cart.types";

interface CheckoutSummaryProps {
  items: CartItem[];
}

export function CheckoutSummary({ items }: CheckoutSummaryProps): ReactElement {
  const unitCount = items.reduce((total, item) => total + item.quantity, 0);

  const subtotalMinor = items.reduce(
    (total, item) => total + item.unitPrice.minorAmount * item.quantity,
    0,
  );

  const subtotal = {
    minorAmount: subtotalMinor,
    currency: "PEN",
  } as const;

  return (
    <aside
      aria-labelledby="checkout-summary-title"
      className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]"
    >
      <h2
        id="checkout-summary-title"
        className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]"
      >
        Resumen del carrito
      </h2>

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-[var(--color-text)]">
                {item.name}
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {item.quantity} x {formatMoney(item.unitPrice)}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-[var(--color-text)]">
              {formatMoney({
                minorAmount: item.unitPrice.minorAmount * item.quantity,
                currency: item.unitPrice.currency,
              })}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-4">
        <div className="flex justify-between gap-4 text-sm">
          <dt className="text-[var(--color-text-muted)]">Unidades</dt>
          <dd className="font-medium text-[var(--color-text)]">{unitCount}</dd>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-5">
          <dt className="font-semibold text-[var(--color-text)]">
            Subtotal referencial
          </dt>

          <dd className="text-xl font-semibold text-[var(--color-text)]">
            {formatMoney(subtotal)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-5 text-[var(--color-text-muted)]">
        Este importe no es autoritativo. Antes de crear el pedido, NestJS
        volvera a consultar precios y stock.
      </p>

      <Link
        href="/carrito"
        className="mt-5 inline-flex min-h-11 items-center rounded-full text-sm font-medium text-[var(--color-text-muted)] underline-offset-4 hover:text-[var(--color-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
      >
        Volver al carrito
      </Link>
    </aside>
  );
}
