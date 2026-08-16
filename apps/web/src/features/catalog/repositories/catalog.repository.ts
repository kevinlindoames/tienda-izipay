import { catalogCategories, catalogProducts } from "../data/catalog.mock";
import type {
  CatalogFilters,
  CatalogResult,
  CatalogSort,
  Product,
} from "../types/catalog.types";

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es-PE")
    .trim();
}

function sortProducts(products: Product[], sort: CatalogSort): Product[] {
  return [...products].sort((left, right) => {
    switch (sort) {
      case "name-asc":
        return left.name.localeCompare(right.name, "es-PE");
      case "price-asc":
        return left.price.minorAmount - right.price.minorAmount;
      case "price-desc":
        return right.price.minorAmount - left.price.minorAmount;
      case "featured":
      default:
        return Number(right.featured) - Number(left.featured);
    }
  });
}

export interface CatalogRepository {
  list(filters: CatalogFilters): Promise<CatalogResult>;
  getBySlug(slug: string): Promise<Product | null>;
  getAllSlugs(): Promise<string[]>;
}

class MockCatalogRepository implements CatalogRepository {
  async list(filters: CatalogFilters): Promise<CatalogResult> {
    const query = normalizeSearchValue(filters.q);
    const category = filters.category.trim();

    const filtered = catalogProducts.filter((product) => {
      if (!product.active) {
        return false;
      }

      if (category && product.categorySlug !== category) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = normalizeSearchValue(
        [
          product.name,
          product.sku,
          product.shortDescription,
          product.description,
        ].join(" "),
      );

      return searchable.includes(query);
    });

    const sorted = sortProducts(filtered, filters.sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
    const page = Math.min(Math.max(filters.page, 1), totalPages);
    const start = (page - 1) * filters.pageSize;

    return {
      products: sorted.slice(start, start + filters.pageSize),
      categories: catalogCategories,
      total,
      page,
      pageSize: filters.pageSize,
      totalPages,
    };
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return (
      catalogProducts.find(
        (product) => product.active && product.slug === slug,
      ) ?? null
    );
  }

  async getAllSlugs(): Promise<string[]> {
    return catalogProducts
      .filter((product) => product.active)
      .map((product) => product.slug);
  }
}

export const catalogRepository: CatalogRepository = new MockCatalogRepository();
