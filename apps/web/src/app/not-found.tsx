import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound(): ReactElement {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[var(--color-page)] py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
            404
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl">
            {"P\u00e1gina no encontrada"}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
            {
              "La direcci\u00f3n solicitada no existe o todav\u00eda no est\u00e1 disponible."
            }
          </p>

          <div className="mt-8">
            <Button href="/">Volver al inicio</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
