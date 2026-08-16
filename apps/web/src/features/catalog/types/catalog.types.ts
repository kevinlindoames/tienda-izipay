import type { OrderedMediaAsset } from "@/types/media.types";

export type CatalogCurrency = "PEN";

export type CatalogSort = "featured" | "name-asc" | "price-asc" | "price-desc";

export type ProductAvailability = "in-stock" | "low-stock" | "out-of-stock";

export interface Money {
  minorAmount: number;
  currency: CatalogCurrency;
}

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export type ProductImage = OrderedMediaAsset;

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  price: Money;
  compareAtPrice?: Money;
  availability: ProductAvailability;
  active: boolean;
  featured: boolean;
  categorySlug: string;
  images: ProductImage[];
}

export interface CatalogFilters {
  q: string;
  category: string;
  sort: CatalogSort;
  page: number;
  pageSize: number;
}

export interface CatalogResult {
  products: Product[];
  categories: CatalogCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
