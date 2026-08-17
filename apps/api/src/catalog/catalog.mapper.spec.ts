import { MediaProvider, ProductStatus } from '../generated/prisma/client';

import { CatalogMapper, type CatalogProductRecord } from './catalog.mapper';

function createProductRecord(
  stockOnHand = 20,
  reserved = 0,
): CatalogProductRecord {
  const now = new Date('2026-08-16T20:00:00.000Z');

  return {
    id: 'product-camera-pro',
    slug: 'camara-pro-4k',
    sku: 'VID-001',
    name: 'Camara Pro 4K',
    shortDescription: 'Descripcion corta.',
    description: 'Descripcion completa.',
    priceMinor: 129900,
    compareAtPriceMinor: 149900,
    currency: 'PEN',
    status: ProductStatus.ACTIVE,
    featured: true,
    categoryId: 'category-video',
    createdAt: now,
    updatedAt: now,
    category: {
      id: 'category-video',
      slug: 'video',
      name: 'Video',
      description: null,
      isActive: true,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    images: [
      {
        id: 'catalog-image-1',
        productId: 'product-camera-pro',
        mediaAssetId: 'media-catalog-image-1',
        position: 1,
        isPrimary: true,
        createdAt: now,
        updatedAt: now,
        mediaAsset: {
          id: 'media-catalog-image-1',
          provider: MediaProvider.MOCK,
          bucket: null,
          storageKey: null,
          desktopUrl: 'https://example.com/desktop.jpg',
          mobileUrl: 'https://example.com/mobile.jpg',
          alt: 'Producto',
          width: 900,
          height: 900,
          mimeType: null,
          createdAt: now,
          updatedAt: now,
        },
      },
    ],
    inventory: {
      id: 'inventory-camera-pro',
      productId: 'product-camera-pro',
      stockOnHand,
      reserved,
      lowStockThreshold: 5,
      trackStock: true,
      allowBackorder: false,
      version: 0,
      createdAt: now,
      updatedAt: now,
    },
  };
}

describe('CatalogMapper', () => {
  it('maps the public product contract', () => {
    const result = CatalogMapper.toProduct(createProductRecord());

    expect(result).toEqual({
      id: 'product-camera-pro',
      slug: 'camara-pro-4k',
      sku: 'VID-001',
      name: 'Camara Pro 4K',
      shortDescription: 'Descripcion corta.',
      description: 'Descripcion completa.',
      price: {
        minorAmount: 129900,
        currency: 'PEN',
      },
      compareAtPrice: {
        minorAmount: 149900,
        currency: 'PEN',
      },
      availability: 'in-stock',
      active: true,
      featured: true,
      categorySlug: 'video',
      images: [
        {
          id: 'catalog-image-1',
          desktopSrc: 'https://example.com/desktop.jpg',
          mobileSrc: 'https://example.com/mobile.jpg',
          alt: 'Producto',
          width: 900,
          height: 900,
          position: 1,
          isPrimary: true,
        },
      ],
    });
  });

  it('derives low stock from available inventory', () => {
    const result = CatalogMapper.toProduct(createProductRecord(5, 2));

    expect(result.availability).toBe('low-stock');
  });

  it('derives out of stock when no stock is available', () => {
    const result = CatalogMapper.toProduct(createProductRecord(2, 2));

    expect(result.availability).toBe('out-of-stock');
  });
});
