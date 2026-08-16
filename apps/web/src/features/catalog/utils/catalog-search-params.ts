import type { CatalogFilters, CatalogSort } from "../types/catalog.types";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

const validSorts = new Set<CatalogSort>([
  "featured",
  "name-asc",
  "price-asc",
  "price-desc",
]);

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function parseCatalogSearchParams(
  searchParams: CatalogSearchParams,
): CatalogFilters {
  const rawPage = Number.parseInt(firstValue(searchParams.page), 10);
  const rawSort = firstValue(searchParams.sort) as CatalogSort;

  return {
    q: firstValue(searchParams.q).trim(),
    category: firstValue(searchParams.category).trim(),
    sort: validSorts.has(rawSort) ? rawSort : "featured",
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    pageSize: 6,
  };
}

export function buildCatalogHref(
  filters: Pick<CatalogFilters, "q" | "category" | "sort">,
  page: number,
): string {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/productos?${query}` : "/productos";
}
