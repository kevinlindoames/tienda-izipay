import Link from "next/link";
import type { ReactElement } from "react";

import type { CatalogCategory, CatalogFilters } from "../types/catalog.types";

interface CatalogFiltersProps {
  categories: CatalogCategory[];
  filters: CatalogFilters;
}

export function CatalogFilters({
  categories,
  filters,
}: CatalogFiltersProps): ReactElement {
  return (
    <form
      action="/productos"
      method="get"
      className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
      aria-label="Filtros del catalogo"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)_minmax(12rem,0.45fr)_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-medium text-[var(--color-text)]">
          Buscar
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Nombre, codigo o descripcion"
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/30"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--color-text)]">
          Categoria
          <select
            name="category"
            defaultValue={filters.category}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 text-[var(--color-text)] outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/30"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[var(--color-text)]">
          Ordenar
          <select
            name="sort"
            defaultValue={filters.sort}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 text-[var(--color-text)] outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/30"
          >
            <option value="featured">Destacados</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="price-asc">Precio menor a mayor</option>
            <option value="price-desc">Precio mayor a menor</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-dark)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-dark-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
          >
            Aplicar
          </button>

          <Link
            href="/productos"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            Limpiar
          </Link>
        </div>
      </div>
    </form>
  );
}
