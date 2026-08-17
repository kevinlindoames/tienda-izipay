import { ApiHttpError, apiGet } from "@/lib/api/api-client.server";

import type {
  CatalogCategory,
  CatalogFilters,
  CatalogResult,
  Product,
} from "../types/catalog.types";

interface CatalogPaginationPayload {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CatalogProductListPayload {
  products: Product[];
  pagination: CatalogPaginationPayload;
}

interface CatalogCategoryListPayload {
  categories: CatalogCategory[];
}

interface CatalogProductDetailPayload {
  product: Product;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isMoney(value: unknown): value is Product["price"] {
  return (
    isRecord(value) &&
    isNonNegativeInteger(value.minorAmount) &&
    value.currency === "PEN"
  );
}

function isProductImage(value: unknown): value is Product["images"][number] {
  if (!isRecord(value)) {
    return false;
  }

  const desktopSrcIsValid =
    value.desktopSrc === null || typeof value.desktopSrc === "string";

  const mobileSrcIsValid =
    value.mobileSrc === undefined ||
    value.mobileSrc === null ||
    typeof value.mobileSrc === "string";

  const widthIsValid =
    value.width === undefined || isPositiveInteger(value.width);

  const heightIsValid =
    value.height === undefined || isPositiveInteger(value.height);

  return (
    typeof value.id === "string" &&
    desktopSrcIsValid &&
    mobileSrcIsValid &&
    typeof value.alt === "string" &&
    widthIsValid &&
    heightIsValid &&
    isNonNegativeInteger(value.position) &&
    typeof value.isPrimary === "boolean"
  );
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) {
    return false;
  }

  const availabilityIsValid =
    value.availability === "in-stock" ||
    value.availability === "low-stock" ||
    value.availability === "out-of-stock";

  const compareAtPriceIsValid =
    value.compareAtPrice === undefined || isMoney(value.compareAtPrice);

  return (
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.sku === "string" &&
    typeof value.name === "string" &&
    typeof value.shortDescription === "string" &&
    typeof value.description === "string" &&
    isMoney(value.price) &&
    compareAtPriceIsValid &&
    availabilityIsValid &&
    typeof value.active === "boolean" &&
    typeof value.featured === "boolean" &&
    typeof value.categorySlug === "string" &&
    isUnknownArray(value.images) &&
    value.images.every(isProductImage)
  );
}

function isCategory(value: unknown): value is CatalogCategory {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.description === "string"
  );
}

function isPagination(value: unknown): value is CatalogPaginationPayload {
  return (
    isRecord(value) &&
    isNonNegativeInteger(value.total) &&
    isPositiveInteger(value.page) &&
    isPositiveInteger(value.limit) &&
    isPositiveInteger(value.totalPages)
  );
}

function isProductListPayload(
  value: unknown,
): value is CatalogProductListPayload {
  return (
    isRecord(value) &&
    isUnknownArray(value.products) &&
    value.products.every(isProduct) &&
    isPagination(value.pagination)
  );
}

function isCategoryListPayload(
  value: unknown,
): value is CatalogCategoryListPayload {
  return (
    isRecord(value) &&
    isUnknownArray(value.categories) &&
    value.categories.every(isCategory)
  );
}

function isProductDetailPayload(
  value: unknown,
): value is CatalogProductDetailPayload {
  return isRecord(value) && isProduct(value.product);
}

function parseProductListPayload(value: unknown): CatalogProductListPayload {
  if (!isProductListPayload(value)) {
    throw new Error("Catalog API returned an invalid product-list contract.");
  }

  return value;
}

function parseCategoryListPayload(value: unknown): CatalogCategoryListPayload {
  if (!isCategoryListPayload(value)) {
    throw new Error("Catalog API returned an invalid category-list contract.");
  }

  return value;
}

function parseProductDetailPayload(
  value: unknown,
): CatalogProductDetailPayload {
  if (!isProductDetailPayload(value)) {
    throw new Error("Catalog API returned an invalid product-detail contract.");
  }

  return value;
}

function buildProductsPath(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  const query = filters.q.trim();
  const category = filters.category.trim();

  if (query) {
    params.set("q", query);
  }

  if (category) {
    params.set("category", category);
  }

  params.set("sort", filters.sort);
  params.set("page", String(filters.page));
  params.set("limit", String(filters.pageSize));

  return `/products?${params.toString()}`;
}

export interface CatalogRepository {
  list(filters: CatalogFilters): Promise<CatalogResult>;
  getBySlug(slug: string): Promise<Product | null>;
}

class ApiCatalogRepository implements CatalogRepository {
  async list(filters: CatalogFilters): Promise<CatalogResult> {
    const [productsValue, categoriesValue] = await Promise.all([
      apiGet(buildProductsPath(filters)),
      apiGet("/categories"),
    ]);

    const productsPayload = parseProductListPayload(productsValue);

    const categoriesPayload = parseCategoryListPayload(categoriesValue);

    return {
      products: productsPayload.products,
      categories: categoriesPayload.categories,
      total: productsPayload.pagination.total,
      page: productsPayload.pagination.page,
      pageSize: productsPayload.pagination.limit,
      totalPages: productsPayload.pagination.totalPages,
    };
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return null;
    }

    try {
      const value = await apiGet(
        `/products/${encodeURIComponent(normalizedSlug)}`,
      );

      return parseProductDetailPayload(value).product;
    } catch (error: unknown) {
      if (error instanceof ApiHttpError && error.status === 404) {
        return null;
      }

      throw error;
    }
  }
}

export const catalogRepository: CatalogRepository = new ApiCatalogRepository();
