import Link from "next/link";
import type { ReactElement } from "react";

import { AdminNav } from "./admin-nav";

export function AdminSidebar(): ReactElement {
  return (
    <aside className="hidden min-h-screen border-r border-[var(--color-border)] bg-[var(--color-surface)] md:block">
      <div className="sticky top-0 flex h-screen flex-col p-5">
        <Link
          href="/admin"
          className="rounded-lg px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
            Tienda Izipay
          </span>

          <span className="mt-1 block text-lg font-semibold text-[var(--color-text)]">
            Administración
          </span>
        </Link>

        <div className="mt-8">
          <AdminNav variant="desktop" />
        </div>

        <div className="mt-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Panel interno
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Catálogo, inventario y pedidos se habilitarán progresivamente.
          </p>
        </div>
      </div>
    </aside>
  );
}
