import { Controller, Get, Param, Query } from '@nestjs/common';

import type {
  CatalogCategoryListResponse,
  CatalogProductDetailResponse,
  CatalogProductListResponse,
  CatalogQueryDto,
} from './catalog.contracts';
import { CatalogQueryPipe, CatalogSlugPipe } from './catalog.query';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  getCategories(): Promise<CatalogCategoryListResponse> {
    return this.catalogService.getCategories();
  }

  @Get('products')
  getProducts(
    @Query(new CatalogQueryPipe())
    query: CatalogQueryDto,
  ): Promise<CatalogProductListResponse> {
    return this.catalogService.listProducts(query);
  }

  @Get('products/:slug')
  getProductBySlug(
    @Param('slug', new CatalogSlugPipe())
    slug: string,
  ): Promise<CatalogProductDetailResponse> {
    return this.catalogService.getProductBySlug(slug);
  }
}
