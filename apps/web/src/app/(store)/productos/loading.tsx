import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/features/catalog/components/product-card-skeleton";

export default function ProductsLoading(): ReactElement {
  return (
    <main aria-busy="true" aria-label="Cargando catalogo">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-page)] py-14 sm:py-16 lg:py-20">
        <Container>
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-5 h-12 max-w-xl rounded-2xl sm:h-14" />
          <Skeleton className="mt-5 h-5 max-w-2xl rounded-full" />
          <Skeleton className="mt-2 h-5 max-w-xl rounded-full" />
        </Container>
      </section>

      <Container className="py-10 sm:py-12 lg:py-16">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)_minmax(12rem,0.45fr)_auto]">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </main>
  );
}
