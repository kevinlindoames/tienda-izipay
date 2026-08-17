import { BadRequestException } from '@nestjs/common';

import { parseCatalogQuery, parseProductSlug } from './catalog.query';

describe('catalog query', () => {
  it('uses safe defaults', () => {
    expect(parseCatalogQuery({})).toEqual({
      q: '',
      category: '',
      sort: 'featured',
      page: 1,
      limit: 12,
    });
  });

  it('normalizes supported values', () => {
    expect(
      parseCatalogQuery({
        q: '  Camara  ',
        category: ' VIDEO ',
        sort: 'price-asc',
        page: '2',
        limit: '6',
      }),
    ).toEqual({
      q: 'Camara',
      category: 'video',
      sort: 'price-asc',
      page: 2,
      limit: 6,
    });
  });

  it('rejects an unsupported sort', () => {
    expect(() =>
      parseCatalogQuery({
        sort: 'newest',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects an invalid page', () => {
    expect(() =>
      parseCatalogQuery({
        page: '0',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects a limit above the API maximum', () => {
    expect(() =>
      parseCatalogQuery({
        limit: '51',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects duplicate query values', () => {
    expect(() =>
      parseCatalogQuery({
        page: ['1', '2'],
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects unknown query parameters', () => {
    expect(() =>
      parseCatalogQuery({
        random: 'value',
      }),
    ).toThrow(BadRequestException);
  });

  it('normalizes a valid product slug', () => {
    expect(parseProductSlug(' CAMARA-PRO-4K ')).toBe('camara-pro-4k');
  });

  it('rejects an invalid product slug', () => {
    expect(() => parseProductSlug('../producto')).toThrow(BadRequestException);
  });
});
