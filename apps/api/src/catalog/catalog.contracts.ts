export const catalogSortValues = [
  'featured',
  'name-asc',
  'price-asc',
  'price-desc',
] as const;

export type CatalogSort = (typeof catalogSortValues)[number];

export type ProductAvailability = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface MoneyResponse {
  minorAmount: number;
  currency: string;
}

export interface CatalogCategoryResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface ProductImageResponse {
  id: string;
  desktopSrc: string | null;
  mobileSrc?: string | null;
  alt: string;
  width?: number;
  height?: number;
  position: number;
  isPrimary: boolean;
}

export interface CatalogProductResponse {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  price: MoneyResponse;
  compareAtPrice?: MoneyResponse;
  availability: ProductAvailability;
  active: boolean;
  featured: boolean;
  categorySlug: string;
  images: ProductImageResponse[];
}

export interface CatalogQueryDto {
  q: string;
  category: string;
  sort: CatalogSort;
  page: number;
  limit: number;
}

export interface CatalogPaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CatalogProductListResponse {
  products: CatalogProductResponse[];
  pagination: CatalogPaginationResponse;
}

export interface CatalogCategoryListResponse {
  categories: CatalogCategoryResponse[];
}

export interface CatalogProductDetailResponse {
  product: CatalogProductResponse;
}
