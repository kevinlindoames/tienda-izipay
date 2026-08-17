import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/features/catalog/utils/format-money";

interface CartSummaryProps {
  unitCount: number;
  subtotalMinor: number;
}

export function CartSummary({
  unitCount,
  subtotalMinor,
}: CartSummaryProps): ReactElement {
  const subtotal = {
    minorAmount: subtotalMinor,
    currency: "PEN",
  } as const;

  return (
    <aside
      aria-labelledby="cart-summary-title"
      className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:sticky lg:top-[calc(var(--header-height)+2rem)]"
    >
      <h2
        id="cart-summary-title"
        className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]"
      >
        Resumen
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <dt className="text-[var(--color-text-muted)]">Unidades</dt>

          <dd className="font-medium text-[var(--color-text)]">{unitCount}</dd>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-5">
          <dt className="text-base font-semibold text-[var(--color-text)]">
            Subtotal referencial
          </dt>

          <dd className="text-xl font-semibold text-[var(--color-text)]">
            {formatMoney(subtotal)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button href="/checkout" className="w-full">
          Continuar al checkout
        </Button>
      </div>

      <p className="mt-4 text-xs leading-5 text-[var(--color-text-muted)]">
        Antes de crear el pedido, NestJS volvera a validar precios y stock.
      </p>
    </aside>
  );
}
