import { AdminRole } from '../../src/generated/prisma/client';
import {
  E2eSafetyError,
  type MutableE2eTarget,
} from '../../src/config/e2e-database-target';
import { E2E_FIXTURE_IDS, E2E_PRODUCT_FIXTURES } from './e2e-fixtures';
import { createScopedE2ePrismaClient } from './e2e-prisma';

const EXPECTED_MIGRATIONS = [
  '20260817002814_init_catalog_persistence',
  '20260817041706_add_orders',
  '20260817060014_add_admin_auth',
] as const;

const EXPECTED_CONSTRAINTS = [
  'inventories_reserved_stock_policy_check',
  'inventory_movements_nonzero_change_check',
  'order_items_productId_fkey',
  'products_priceMinor_nonnegative_check',
] as const;

const EXPECTED_INDEXES = [
  'product_images_one_primary_per_product_key',
  'products_sku_key',
  'products_slug_key',
] as const;

interface DatabaseRow {
  databaseName: string;
}

interface MigrationRow {
  finishedAt: Date | null;
  migrationName: string;
  rolledBackAt: Date | null;
}

interface NameRow {
  name: string;
}

interface SchemaRow {
  marker: string | null;
}

function assertExpectedNames(
  actualNames: Iterable<string>,
  expectedNames: readonly string[],
  message: string,
): void {
  const actual = new Set(actualNames);

  if (!expectedNames.every((name) => actual.has(name))) {
    throw new E2eSafetyError(message);
  }
}

export async function runE2eSmoke(target: MutableE2eTarget): Promise<void> {
  const prisma = createScopedE2ePrismaClient(target);
  const quotedSchema = `"${target.schema}"`;

  try {
    const [
      databaseRows,
      schemaRows,
      migrations,
      constraints,
      indexes,
      admins,
      categories,
      products,
      historicalOrder,
    ] = await Promise.all([
      prisma.$queryRawUnsafe<DatabaseRow[]>(
        'SELECT current_database() AS "databaseName"',
      ),
      prisma.$queryRawUnsafe<SchemaRow[]>(
        `SELECT obj_description(oid, 'pg_namespace') AS "marker"
           FROM pg_namespace
          WHERE nspname = $1`,
        target.schema,
      ),
      prisma.$queryRawUnsafe<MigrationRow[]>(
        `SELECT migration_name AS "migrationName",
                finished_at AS "finishedAt",
                rolled_back_at AS "rolledBackAt"
           FROM ${quotedSchema}."_prisma_migrations"`,
      ),
      prisma.$queryRawUnsafe<NameRow[]>(
        `SELECT constraint_name AS "name"
           FROM information_schema.table_constraints
          WHERE constraint_schema = $1`,
        target.schema,
      ),
      prisma.$queryRawUnsafe<NameRow[]>(
        `SELECT indexname AS "name"
           FROM pg_indexes
          WHERE schemaname = $1`,
        target.schema,
      ),
      prisma.adminUser.findMany({
        where: { id: { in: [...E2E_FIXTURE_IDS.admins] } },
        select: { email: true, id: true, isActive: true, role: true },
      }),
      prisma.category.findMany({
        where: { id: { in: [...E2E_FIXTURE_IDS.categories] } },
        select: { id: true, isActive: true, slug: true },
      }),
      prisma.product.findMany({
        where: { id: { in: [...E2E_FIXTURE_IDS.products] } },
        include: {
          category: true,
          images: { include: { mediaAsset: true } },
          inventory: true,
        },
      }),
      prisma.order.findUnique({
        where: { id: E2E_FIXTURE_IDS.historicalOrder },
        include: { items: true },
      }),
    ]);

    if (databaseRows[0]?.databaseName !== target.databaseName) {
      throw new E2eSafetyError(
        'E2E smoke failed because the database identity is incorrect.',
      );
    }

    if (schemaRows[0]?.marker !== target.marker) {
      throw new E2eSafetyError(
        'E2E smoke failed because the schema marker is incorrect.',
      );
    }

    if (
      migrations.some(
        (migration) =>
          migration.finishedAt === null || migration.rolledBackAt !== null,
      )
    ) {
      throw new E2eSafetyError(
        'E2E smoke found an unfinished or rolled-back database migration.',
      );
    }

    assertExpectedNames(
      migrations
        .filter((migration) => migration.finishedAt !== null)
        .map((migration) => migration.migrationName),
      EXPECTED_MIGRATIONS,
      'E2E smoke did not find every required migration.',
    );
    assertExpectedNames(
      constraints.map((constraint) => constraint.name),
      EXPECTED_CONSTRAINTS,
      'E2E smoke did not find every required database constraint.',
    );
    assertExpectedNames(
      indexes.map((index) => index.name),
      EXPECTED_INDEXES,
      'E2E smoke did not find every required database index.',
    );

    const owner = admins.find(
      (admin) => admin.id === E2E_FIXTURE_IDS.admins[0],
    );
    const administrator = admins.find(
      (admin) => admin.id === E2E_FIXTURE_IDS.admins[1],
    );

    if (
      admins.length !== E2E_FIXTURE_IDS.admins.length ||
      !owner?.isActive ||
      owner.role !== AdminRole.OWNER ||
      owner.email !== 'owner@tienda-izipay-e2e.invalid' ||
      !administrator?.isActive ||
      administrator.role !== AdminRole.ADMIN ||
      administrator.email !== 'admin@tienda-izipay-e2e.invalid'
    ) {
      throw new E2eSafetyError(
        'E2E smoke did not find the expected administrator fixtures.',
      );
    }

    const activeCategory = categories.find(
      (category) => category.id === E2E_FIXTURE_IDS.categories[0],
    );
    const inactiveCategory = categories.find(
      (category) => category.id === E2E_FIXTURE_IDS.categories[1],
    );

    if (
      !activeCategory?.isActive ||
      inactiveCategory?.isActive !== false ||
      activeCategory.slug !== 'e2e-active-category' ||
      inactiveCategory.slug !== 'e2e-inactive-category'
    ) {
      throw new E2eSafetyError(
        'E2E smoke did not find the expected category fixtures.',
      );
    }

    for (const expectedProduct of E2E_PRODUCT_FIXTURES) {
      const product = products.find(
        (candidate) => candidate.id === expectedProduct.id,
      );

      if (
        !product ||
        product.slug !== expectedProduct.slug ||
        product.sku !== expectedProduct.sku ||
        product.name !== expectedProduct.name ||
        product.priceMinor !== expectedProduct.priceMinor ||
        product.status !== expectedProduct.status ||
        product.categoryId !== expectedProduct.categoryId ||
        product.inventory?.stockOnHand !== expectedProduct.stockOnHand ||
        product.inventory.reserved !== 0 ||
        product.images.length !== 1 ||
        product.images[0]?.isPrimary !== true ||
        product.images[0].mediaAsset.desktopUrl !== '/e2e/placeholder.png' ||
        product.images[0].mediaAsset.mobileUrl !== '/e2e/placeholder.png'
      ) {
        throw new E2eSafetyError(
          'E2E smoke did not find a required product fixture relationship.',
        );
      }
    }

    if (
      !historicalOrder ||
      historicalOrder.items.length !== 1 ||
      historicalOrder.items[0]?.id !== E2E_FIXTURE_IDS.historicalOrderItem ||
      historicalOrder.items[0].productId !== E2E_FIXTURE_IDS.products[5]
    ) {
      throw new E2eSafetyError(
        'E2E smoke did not find the expected historical order fixture.',
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}
