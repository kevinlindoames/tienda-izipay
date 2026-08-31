import type { ReactElement } from "react";

interface AdminSectionPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  milestone: string;
}

export function AdminSectionPlaceholder({
  eyebrow,
  title,
  description,
  milestone,
}: AdminSectionPlaceholderProps): ReactElement {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:text-base">
          {description}
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-brand)]">
          Próximo bloque · {milestone}
        </p>

        <h2 className="mt-3 text-lg font-semibold">Sección preparada</h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          La navegación, protección y composición visual ya están listas. La
          funcionalidad de negocio se implementará en su bloque correspondiente.
        </p>
      </section>
    </div>
  );
}
