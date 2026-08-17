import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, ProductStatus } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';

import type {
  CatalogCategoryListResponse,
  CatalogProductDetailResponse,
  CatalogProductListResponse,
  CatalogQueryDto,
  CatalogSort,
} from './catalog.contracts';
import { CatalogMapper, catalogProductInclude } from './catalog.mapper';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(): Promise<CatalogCategoryListResponse> {
    const categories = await this.prisma.category.findMany({
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

    return {
      categories: categories.map((category) =>
        CatalogMapper.toCategory(category),
      ),
    };
  }

  async listProducts(
    query: CatalogQueryDto,
  ): Promise<CatalogProductListResponse> {
    const categoryWhere: Prisma.CategoryWhereInput = {
      isActive: true,
    };

    if (query.category) {
      categoryWhere.slug = query.category;
    }

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      category: categoryWhere,
    };

    if (query.q) {
      where.OR = [
        {
          slug: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          shortDescription: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query.q,
            mode: 'insensitive',
          },
        },
      ];
    }

    const total = await this.prisma.product.count({
      where,
    });

    const totalPages = Math.max(1, Math.ceil(total / query.limit));

    const page = Math.min(query.page, totalPages);

    const products = await this.prisma.product.findMany({
      where,
      include: catalogProductInclude,
      orderBy: this.getOrderBy(query.sort),
      skip: (page - 1) * query.limit,
      take: query.limit,
    });

    return {
      products: products.map((product) => CatalogMapper.toProduct(product)),
      pagination: {
        total,
        page,
        limit: query.limit,
        totalPages,
      },
    };
  }

  async getProductBySlug(slug: string): Promise<CatalogProductDetailResponse> {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        status: ProductStatus.ACTIVE,
        category: {
          isActive: true,
        },
      },
      include: catalogProductInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return {
      product: CatalogMapper.toProduct(product),
    };
  }

  private getOrderBy(
    sort: CatalogSort,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'name-asc':
        return [
          {
            name: 'asc',
          },
          {
            id: 'asc',
          },
        ];

      case 'price-asc':
        return [
          {
            priceMinor: 'asc',
          },
          {
            name: 'asc',
          },
          {
            id: 'asc',
          },
        ];

      case 'price-desc':
        return [
          {
            priceMinor: 'desc',
          },
          {
            name: 'asc',
          },
          {
            id: 'asc',
          },
        ];

      case 'featured':
      default:
        return [
          {
            featured: 'desc',
          },
          {
            name: 'asc',
          },
          {
            id: 'asc',
          },
        ];
    }
  }
}
