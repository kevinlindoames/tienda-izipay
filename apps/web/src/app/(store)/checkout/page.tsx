import type { Metadata } from "next";
import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { CheckoutView } from "@/features/checkout/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Completa los datos necesarios para preparar tu pedido.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage(): ReactElement {
  return (
    <main>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-page)] py-12 sm:py-14 lg:py-16">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Compra
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
            Completa tus datos de contacto y entrega. Todavia no se realizara
            ningun cobro.
          </p>
        </Container>
      </section>

      <section
        className="py-10 sm:py-12 lg:py-16"
        aria-label="Datos del checkout"
      >
        <Container>
          <CheckoutView />
        </Container>
      </section>
    </main>
  );
}
