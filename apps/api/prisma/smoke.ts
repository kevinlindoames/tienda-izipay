import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for the database smoke test.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main(): Promise<void> {
  const [
    categories,
    products,
    mediaAssets,
    productImages,
    inventories,
    inventoryMovements,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.mediaAsset.count(),
    prisma.productImage.count(),
    prisma.inventory.count(),
    prisma.inventoryMovement.count(),
  ]);

  const result = {
    categories,
    products,
    mediaAssets,
    productImages,
    inventories,
    inventoryMovements,
  };

  console.log(result);

  if (categories !== 3) {
    throw new Error(`Expected 3 categories, received ${categories}.`);
  }

  if (products !== 8) {
    throw new Error(`Expected 8 products, received ${products}.`);
  }

  if (mediaAssets !== 8) {
    throw new Error(`Expected 8 media assets, received ${mediaAssets}.`);
  }

  if (productImages !== 8) {
    throw new Error(`Expected 8 product images, received ${productImages}.`);
  }

  if (inventories !== 8) {
    throw new Error(`Expected 8 inventories, received ${inventories}.`);
  }

  if (inventoryMovements !== 7) {
    throw new Error(
      `Expected 7 inventory movements, received ${inventoryMovements}.`,
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
