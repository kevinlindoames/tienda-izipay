import { Prisma, ProductStatus } from '../generated/prisma/client';

import type {
  CatalogCategoryResponse,
  CatalogProductResponse,
  ProductAvailability,
  ProductImageResponse,
} from './catalog.contracts';

export const catalogProductInclude = {
  category: true,
  images: {
    include: {
      mediaAsset: true,
    },
    orderBy: [
      {
        position: 'asc',
      },
      {
        id: 'asc',
      },
    ],
  },
  inventory: true,
} satisfies Prisma.ProductInclude;

export type CatalogProductRecord = Prisma.ProductGetPayload<{
  include: typeof catalogProductInclude;
}>;

export interface CatalogCategoryRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

function getAvailability(
  inventory: CatalogProductRecord['inventory'],
): ProductAvailability {
  if (!inventory) {
    return 'out-of-stock';
  }

  if (!inventory.trackStock) {
    return 'in-stock';
  }

  const availableStock = inventory.stockOnHand - inventory.reserved;

  if (availableStock <= 0) {
    return 'out-of-stock';
  }

  if (availableStock <= inventory.lowStockThreshold) {
    return 'low-stock';
  }

  return 'in-stock';
}

function mapImage(
  image: CatalogProductRecord['images'][number],
): ProductImageResponse {
  const media = image.mediaAsset;

  return {
    id: image.id,
    desktopSrc: media.desktopUrl,
    mobileSrc: media.mobileUrl,
    alt: media.alt,
    ...(media.width === null
      ? {}
      : {
          width: media.width,
        }),
    ...(media.height === null
      ? {}
      : {
          height: media.height,
        }),
    position: image.position,
    isPrimary: image.isPrimary,
  };
}

export class CatalogMapper {
  static toCategory(category: CatalogCategoryRecord): CatalogCategoryResponse {
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description ?? '',
    };
  }

  static toProduct(product: CatalogProductRecord): CatalogProductResponse {
    return {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: {
        minorAmount: product.priceMinor,
        currency: product.currency,
      },
      ...(product.compareAtPriceMinor === null
        ? {}
        : {
            compareAtPrice: {
              minorAmount: product.compareAtPriceMinor,
              currency: product.currency,
            },
          }),
      availability: getAvailability(product.inventory),
      active: product.status === ProductStatus.ACTIVE,
      featured: product.featured,
      categorySlug: product.category.slug,
      images: product.images.map(mapImage),
    };
  }
}
