"use client";

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({
  error,
  reset,
}: ProductsErrorProps): ReactElement {
  return (
    <main>
      <Container className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          Catalogo
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          No pudimos cargar los productos
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
          Ocurrio un error inesperado. Puedes intentar cargar nuevamente el
          catalogo.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <p className="mx-auto mt-4 max-w-xl break-words text-xs text-[var(--color-text-muted)]">
            {error.message}
          </p>
        ) : null}
        <div className="mt-8">
          <Button onClick={reset}>Reintentar</Button>
        </div>
      </Container>
    </main>
  );
}
