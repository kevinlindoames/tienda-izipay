import type { ReactElement } from "react";

import type { CreatedOrderSummary } from "../types/order.types";

interface OrderSuccessProps {
  order: CreatedOrderSummary;
}

function formatMoney(minorAmount: number, currency: string): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
  }).format(minorAmount / 100);
}

export function OrderSuccess({ order }: OrderSuccessProps): ReactElement {
  return (
    <section
      aria-labelledby="order-success-title"
      className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
    >
      <p className="text-sm font-medium text-[var(--color-brand)]">
        Pedido creado correctamente
      </p>

      <h2
        id="order-success-title"
        className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]"
      >
        {order.orderNumber}
      </h2>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Estado</dt>
          <dd className="mt-1 font-medium text-[var(--color-text)]">
            Pendiente de pago
          </dd>
        </div>

        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">
            Total confirmado
          </dt>
          <dd className="mt-1 font-semibold text-[var(--color-text)]">
            {formatMoney(order.totalMinor, order.currency)}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-sm leading-6 text-[var(--color-text-muted)]">
        El precio y el stock fueron revalidados por el servidor antes de
        registrar el pedido. Todavia no se ha realizado ningun cobro.
      </p>
    </section>
  );
}
