import Link from "next/link";
import type { ReactElement } from "react";

import { ADMIN_DASHBOARD_ACTIONS } from "./dashboard.content";

export function AdminDashboard(): ReactElement {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
          Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          Panel administrativo
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
          Este es el centro de administración de la tienda. Desde aquí podrás
          acceder a las áreas operativas a medida que se habiliten.
        </p>
      </section>

      <section aria-labelledby="admin-sections-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="admin-sections-title"
              className="text-xl font-semibold tracking-[-0.02em]"
            >
              Áreas administrativas
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              La estructura ya está preparada para los siguientes bloques.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {ADMIN_DASHBOARD_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex min-h-52 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
                {action.milestone}
              </span>

              <h3 className="mt-4 text-xl font-semibold">{action.title}</h3>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                {action.description}
              </p>

              <span className="mt-auto pt-6 text-sm font-semibold text-[var(--color-text)]">
                Abrir sección
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="admin-status-title"
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <h2 id="admin-status-title" className="text-lg font-semibold">
          Estado del panel
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          La autenticación y el shell administrativo están disponibles. Los
          datos operativos se incorporarán en J.4, J.5 y J.6; por eso todavía no
          mostramos métricas ficticias.
        </p>
      </section>
    </div>
  );
}
