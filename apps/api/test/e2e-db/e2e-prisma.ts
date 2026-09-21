import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../src/generated/prisma/client';
import type {
  E2eConnectionTarget,
  MutableE2eTarget,
} from '../../src/config/e2e-database-target';

export function createBaseE2ePrismaClient(
  target: E2eConnectionTarget,
): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: target.connectionString,
  });

  return new PrismaClient({ adapter });
}

export function createScopedE2ePrismaClient(
  target: MutableE2eTarget,
): PrismaClient {
  const adapter = new PrismaPg(
    { connectionString: target.connectionString },
    { schema: target.schema },
  );

  return new PrismaClient({ adapter });
}
