import Link from "next/link";
import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";

export default function ProductNotFound(): ReactElement {
  return (
    <main>
      <Container className="py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          Producto
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text)]">
          Producto no encontrado
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
          El producto solicitado no existe o ya no esta disponible en este
          catalogo provisional.
        </p>
        <Link
          href="/productos"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-dark)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-dark-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
        >
          Volver al catalogo
        </Link>
      </Container>
    </main>
  );
}
