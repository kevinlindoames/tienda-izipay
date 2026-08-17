import { NotFoundException } from '@nestjs/common';

import { ProductStatus } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';

import type {
  CatalogProductResponse,
  CatalogQueryDto,
} from './catalog.contracts';
import { CatalogMapper } from './catalog.mapper';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  const categoryFindMany = jest.fn<Promise<unknown[]>, [unknown?]>();

  const productCount = jest.fn<Promise<number>, [unknown?]>();

  const productFindMany = jest.fn<Promise<unknown[]>, [unknown?]>();

  const productFindFirst = jest.fn<Promise<unknown>, [unknown?]>();

  const prismaMock = {
    category: {
      findMany: categoryFindMany,
    },
    product: {
      count: productCount,
      findMany: productFindMany,
      findFirst: productFindFirst,
    },
  };

  const prisma = prismaMock as unknown as PrismaService;

  let service: CatalogService;

  const mappedProduct: CatalogProductResponse = {
    id: 'product-camera-pro',
    slug: 'camara-pro-4k',
    sku: 'VID-001',
    name: 'Camara Pro 4K',
    shortDescription: 'Descripcion corta.',
    description: 'Descripcion.',
    price: {
      minorAmount: 129900,
      currency: 'PEN',
    },
    availability: 'in-stock',
    active: true,
    featured: true,
    categorySlug: 'video',
    images: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new CatalogService(prisma);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns active categories in public order', async () => {
    categoryFindMany.mockResolvedValue([
      {
        id: 'category-video',
        slug: 'video',
        name: 'Video',
        description: null,
      },
    ]);

    await expect(service.getCategories()).resolves.toEqual({
      categories: [
        {
          id: 'category-video',
          slug: 'video',
          name: 'Video',
          description: '',
        },
      ],
    });

    expect(categoryFindMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          name: 'asc',
        },
      ],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
      },
    });
  });

  it('filters, paginates and clamps an excessive page', async () => {
    productCount.mockResolvedValue(8);

    productFindMany.mockResolvedValue([{}]);

    jest.spyOn(CatalogMapper, 'toProduct').mockReturnValue(mappedProduct);

    const query: CatalogQueryDto = {
      q: 'camara',
      category: 'video',
      sort: 'price-asc',
      page: 99,
      limit: 3,
    };

    const result = await service.listProducts(query);

    expect(result).toEqual({
      products: [mappedProduct],
      pagination: {
        total: 8,
        page: 3,
        limit: 3,
        totalPages: 3,
      },
    });

    expect(productCount).toHaveBeenCalledWith({
      where: {
        status: ProductStatus.ACTIVE,
        category: {
          isActive: true,
          slug: 'video',
        },
        OR: [
          {
            slug: {
              contains: 'camara',
              mode: 'insensitive',
            },
          },
          {
            sku: {
              contains: 'camara',
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: 'camara',
              mode: 'insensitive',
            },
          },
          {
            shortDescription: {
              contains: 'camara',
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: 'camara',
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    expect(productFindMany).toHaveBeenCalledTimes(1);

    const findManyArgs = productFindMany.mock.calls[0]?.[0];

    if (typeof findManyArgs !== 'object' || findManyArgs === null) {
      throw new Error('Expected product findMany arguments.');
    }

    expect(findManyArgs).toHaveProperty('skip', 6);

    expect(findManyArgs).toHaveProperty('take', 3);
  });

  it('returns one active product by slug', async () => {
    productFindFirst.mockResolvedValue({});

    jest.spyOn(CatalogMapper, 'toProduct').mockReturnValue(mappedProduct);

    await expect(service.getProductBySlug('camara-pro-4k')).resolves.toEqual({
      product: mappedProduct,
    });

    expect(productFindFirst).toHaveBeenCalledTimes(1);
  });

  it('returns 404 when the product does not exist', async () => {
    productFindFirst.mockResolvedValue(null);

    await expect(service.getProductBySlug('no-existe')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
