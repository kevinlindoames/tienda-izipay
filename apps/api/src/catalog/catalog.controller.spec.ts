import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';

import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController HTTP', () => {
  let app: INestApplication;

  const serviceMock = {
    getCategories: jest.fn(),
    listProducts: jest.fn(),
    getProductBySlug: jest.fn(),
  };

  function getHttpServer(): Server {
    return app.getHttpServer() as Server;
  }

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('parses the products query before calling the service', async () => {
    serviceMock.listProducts.mockResolvedValue({
      products: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 1,
      },
    });

    await request(getHttpServer())
      .get(
        '/api/v1/products?q=Camara&category=VIDEO&sort=price-asc&page=2&limit=6',
      )
      .expect(200);

    expect(serviceMock.listProducts).toHaveBeenCalledWith({
      q: 'Camara',
      category: 'video',
      sort: 'price-asc',
      page: 2,
      limit: 6,
    });
  });

  it('returns 400 for an invalid products query', async () => {
    await request(getHttpServer()).get('/api/v1/products?limit=51').expect(400);

    expect(serviceMock.listProducts).not.toHaveBeenCalled();
  });

  it('normalizes the product slug', async () => {
    serviceMock.getProductBySlug.mockResolvedValue({
      product: {
        id: 'product-camera-pro',
      },
    });

    await request(getHttpServer())
      .get('/api/v1/products/CAMARA-PRO-4K')
      .expect(200);

    expect(serviceMock.getProductBySlug).toHaveBeenCalledWith('camara-pro-4k');
  });

  it('exposes the categories route', async () => {
    serviceMock.getCategories.mockResolvedValue({
      categories: [],
    });

    await request(getHttpServer()).get('/api/v1/categories').expect(200);

    expect(serviceMock.getCategories).toHaveBeenCalledTimes(1);
  });
});
