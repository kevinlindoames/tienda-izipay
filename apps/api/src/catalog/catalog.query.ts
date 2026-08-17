import { BadRequestException, PipeTransform } from '@nestjs/common';

import { catalogSortValues, type CatalogQueryDto } from './catalog.contracts';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 120;
const MAX_PRODUCT_SLUG_LENGTH = 160;

const allowedQueryKeys = new Set(['q', 'category', 'sort', 'page', 'limit']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readSingleString(
  query: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = query[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new BadRequestException(`${key} must be a single string value.`);
  }

  return value;
}

function parsePositiveInteger(
  query: Record<string, unknown>,
  key: string,
  fallback: number,
  maximum?: number,
): number {
  const value = readSingleString(query, key);

  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim();

  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new BadRequestException(`${key} must be a positive integer.`);
  }

  const parsed = Number(normalized);

  if (!Number.isSafeInteger(parsed)) {
    throw new BadRequestException(`${key} is outside the supported range.`);
  }

  if (maximum !== undefined && parsed > maximum) {
    throw new BadRequestException(
      `${key} must be less than or equal to ${maximum}.`,
    );
  }

  return parsed;
}

export function parseCatalogQuery(value: unknown): CatalogQueryDto {
  const query = value === undefined || value === null ? {} : value;

  if (!isRecord(query)) {
    throw new BadRequestException('Catalog query must be an object.');
  }

  for (const key of Object.keys(query)) {
    if (!allowedQueryKeys.has(key)) {
      throw new BadRequestException(`Unsupported query parameter: ${key}.`);
    }
  }

  const q = (readSingleString(query, 'q') ?? '').trim();

  if (q.length > MAX_SEARCH_LENGTH) {
    throw new BadRequestException(
      `q must have at most ${MAX_SEARCH_LENGTH} characters.`,
    );
  }

  const category = (readSingleString(query, 'category') ?? '')
    .trim()
    .toLowerCase();

  if (category.length > MAX_CATEGORY_LENGTH) {
    throw new BadRequestException(
      `category must have at most ${MAX_CATEGORY_LENGTH} characters.`,
    );
  }

  if (category && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category)) {
    throw new BadRequestException('category must be a valid slug.');
  }

  const rawSort = (readSingleString(query, 'sort') ?? 'featured').trim();

  const sort = catalogSortValues.find((candidate) => candidate === rawSort);

  if (!sort) {
    throw new BadRequestException(
      `sort must be one of: ${catalogSortValues.join(', ')}.`,
    );
  }

  const page = parsePositiveInteger(query, 'page', DEFAULT_PAGE);

  const limit = parsePositiveInteger(query, 'limit', DEFAULT_LIMIT, MAX_LIMIT);

  return {
    q,
    category,
    sort,
    page,
    limit,
  };
}

export class CatalogQueryPipe implements PipeTransform<
  unknown,
  CatalogQueryDto
> {
  transform(value: unknown): CatalogQueryDto {
    return parseCatalogQuery(value);
  }
}

export function parseProductSlug(value: string): string {
  const slug = value.trim().toLowerCase();

  if (
    !slug ||
    slug.length > MAX_PRODUCT_SLUG_LENGTH ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    throw new BadRequestException('Product slug is invalid.');
  }

  return slug;
}

export class CatalogSlugPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return parseProductSlug(value);
  }
}
