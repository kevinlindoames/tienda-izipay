"use client";

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): ReactElement {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[var(--color-page)] py-16">
      <Container>
        <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-soft)] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Estado de la aplicacion
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)] sm:text-4xl">
            {"Ocurri\u00f3 un problema"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
            {
              "No pudimos completar esta vista. Puedes intentar nuevamente o regresar al inicio."
            }
          </p>

          {error.digest ? (
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Referencia: {error.digest}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset}>Intentar nuevamente</Button>

            <Button href="/" variant="secondary">
              Volver al inicio
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
