import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";

export default function Loading(): ReactElement {
  return (
    <main aria-busy="true" className="min-h-[70vh] bg-[var(--color-page)] py-8">
      <Container>
        <div role="status" aria-live="polite" className="space-y-8">
          <span className="sr-only">Cargando contenido</span>

          <div className="aspect-[4/3] w-full rounded-[var(--radius-card)] bg-[var(--color-surface-soft)] sm:aspect-video" />

          <div className="mx-auto max-w-3xl space-y-4">
            <div className="mx-auto h-8 w-4/5 rounded-full bg-[var(--color-surface-soft)]" />
            <div className="mx-auto h-4 w-full rounded-full bg-[var(--color-surface-soft)]" />
            <div className="mx-auto h-4 w-3/4 rounded-full bg-[var(--color-surface-soft)]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-[var(--radius-card)] bg-[var(--color-surface-soft)]"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
