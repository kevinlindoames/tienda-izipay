import Link from "next/link";
import type { ReactElement } from "react";

import type { CatalogFilters } from "../types/catalog.types";
import { buildCatalogHref } from "../utils/catalog-search-params";

interface CatalogPaginationProps {
  filters: CatalogFilters;
  currentPage: number;
  totalPages: number;
}

export function CatalogPagination({
  filters,
  currentPage,
  totalPages,
}: CatalogPaginationProps): ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const baseFilters = {
    q: filters.q,
    category: filters.category,
    sort: filters.sort,
  };

  return (
    <nav
      aria-label="Paginacion del catalogo"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={buildCatalogHref(baseFilters, currentPage - 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          Anterior
        </Link>
      ) : null}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <Link
            key={page}
            href={buildCatalogHref(baseFilters, page)}
            aria-current={page === currentPage ? "page" : undefined}
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] aria-[current=page]:border-[var(--color-dark)] aria-[current=page]:bg-[var(--color-dark)] aria-[current=page]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildCatalogHref(baseFilters, currentPage + 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          Siguiente
        </Link>
      ) : null}
    </nav>
  );
}
