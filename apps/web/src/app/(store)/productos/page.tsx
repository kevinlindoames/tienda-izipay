import type { Metadata } from "next";
import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import {
  CatalogFilters,
  CatalogPagination,
  ProductGrid,
  catalogRepository,
  parseCatalogSearchParams,
} from "@/features/catalog";
import type { CatalogSearchParams } from "@/features/catalog/utils/catalog-search-params";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catalogo provisional de productos preparado para conectarse posteriormente con la API.",
};

interface ProductsPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps): Promise<ReactElement> {
  const filters = parseCatalogSearchParams(await searchParams);
  const result = await catalogRepository.list(filters);

  return (
    <main>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-page)] py-14 sm:py-16 lg:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Catalogo
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            Productos
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
            Catalogo provisional preparado para validar busqueda, categorias,
            ordenamiento, paginacion y fichas de producto.
          </p>
        </Container>
      </section>

      <section
        className="py-10 sm:py-12 lg:py-16"
        aria-labelledby="catalog-results"
      >
        <Container>
          <CatalogFilters categories={result.categories} filters={filters} />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="catalog-results"
              className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]"
            >
              Resultados
            </h2>
            <p
              className="text-sm text-[var(--color-text-muted)]"
              aria-live="polite"
            >
              {result.total} {result.total === 1 ? "producto" : "productos"}
            </p>
          </div>

          {result.products.length > 0 ? (
            <>
              <div className="mt-6">
                <ProductGrid products={result.products} />
              </div>

              <CatalogPagination
                filters={filters}
                currentPage={result.page}
                totalPages={result.totalPages}
              />
            </>
          ) : (
            <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-[var(--color-text)]">
                No encontramos productos
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
                Prueba con otra busqueda o limpia los filtros para volver a ver
                el catalogo completo.
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
