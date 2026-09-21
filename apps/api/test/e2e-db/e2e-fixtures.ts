import * as bcrypt from 'bcrypt';

import {
  AdminRole,
  DeliveryMode,
  InventoryMovementType,
  MediaProvider,
  OrderStatus,
  PrismaClient,
  ProductStatus,
} from '../../src/generated/prisma/client';
import { E2eSafetyError } from '../../src/config/e2e-database-target';

export const E2E_FIXTURE_IDS = {
  admins: ['e2e-admin-owner', 'e2e-admin-admin'],
  categories: ['e2e-category-active', 'e2e-category-inactive'],
  historicalOrder: 'e2e-order-historical',
  historicalOrderItem: 'e2e-order-item-historical',
  products: [
    'e2e-product-draft',
    'e2e-product-active',
    'e2e-product-archived',
    'e2e-product-slug-conflict',
    'e2e-product-sku-conflict',
    'e2e-product-historical',
  ],
} as const;

export const E2E_PRODUCT_FIXTURES = [
  {
    categoryId: E2E_FIXTURE_IDS.categories[0],
    id: E2E_FIXTURE_IDS.products[0],
    name: 'E2E Draft Product',
    priceMinor: 10900,
    sku: 'E2E-DRAFT-001',
    slug: 'e2e-draft-product',
    status: ProductStatus.DRAFT,
    stockOnHand: 0,
  },
  {
    categoryId: E2E_FIXTURE_IDS.categories[0],
    id: E2E_FIXTURE_IDS.products[1],
    name: 'E2E Active Product',
    priceMinor: 20900,
    sku: 'E2E-ACTIVE-001',
    slug: 'e2e-active-product',
    status: ProductStatus.ACTIVE,
    stockOnHand: 12,
  },
  {
    categoryId: E2E_FIXTURE_IDS.categories[1],
    id: E2E_FIXTURE_IDS.products[2],
    name: 'E2E Archived Product',
    priceMinor: 30900,
    sku: 'E2E-ARCHIVED-001',
    slug: 'e2e-archived-product',
    status: ProductStatus.ARCHIVED,
    stockOnHand: 0,
  },
  {
    categoryId: E2E_FIXTURE_IDS.categories[0],
    id: E2E_FIXTURE_IDS.products[3],
    name: 'E2E Reserved Slug Product',
    priceMinor: 40900,
    sku: 'E2E-SLUG-RESERVED',
    slug: 'e2e-reserved-slug',
    status: ProductStatus.DRAFT,
    stockOnHand: 0,
  },
  {
    categoryId: E2E_FIXTURE_IDS.categories[0],
    id: E2E_FIXTURE_IDS.products[4],
    name: 'E2E Reserved SKU Product',
    priceMinor: 50900,
    sku: 'E2E-SKU-RESERVED',
    slug: 'e2e-reserved-sku',
    status: ProductStatus.DRAFT,
    stockOnHand: 0,
  },
  {
    categoryId: E2E_FIXTURE_IDS.categories[0],
    id: E2E_FIXTURE_IDS.products[5],
    name: 'E2E Historical Product',
    priceMinor: 60900,
    sku: 'E2E-HISTORICAL-001',
    slug: 'e2e-historical-product',
    status: ProductStatus.ARCHIVED,
    stockOnHand: 5,
  },
] as const;

type HashPassword = (password: string, rounds: number) => Promise<string>;

export function requireE2eAdminPassword(
  environment: NodeJS.ProcessEnv,
): string {
  const password = environment.E2E_ADMIN_PASSWORD?.trim();

  if (!password) {
    throw new E2eSafetyError(
      'E2E_ADMIN_PASSWORD is required to create E2E admin fixtures.',
    );
  }

  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new E2eSafetyError(
      'E2E_ADMIN_PASSWORD must contain between 12 and 72 UTF-8 bytes.',
    );
  }

  return password;
}

export async function loadE2eFixtures(
  prisma: PrismaClient,
  adminPassword: string,
  hashPassword: HashPassword = async (password, rounds) =>
    bcrypt.hash(password, rounds),
): Promise<void> {
  const passwordHash = await hashPassword(adminPassword, 12);

  await prisma.$transaction(async (transaction) => {
    await transaction.adminUser.createMany({
      data: [
        {
          email: 'owner@tienda-izipay-e2e.invalid',
          firstName: 'E2E',
          id: E2E_FIXTURE_IDS.admins[0],
          isActive: true,
          lastName: 'Owner Fixture',
          passwordHash,
          role: AdminRole.OWNER,
        },
        {
          email: 'admin@tienda-izipay-e2e.invalid',
          firstName: 'E2E',
          id: E2E_FIXTURE_IDS.admins[1],
          isActive: true,
          lastName: 'Admin Fixture',
          passwordHash,
          role: AdminRole.ADMIN,
        },
      ],
    });

    await transaction.category.createMany({
      data: [
        {
          description: 'Deterministic active category for mutable E2E tests.',
          id: E2E_FIXTURE_IDS.categories[0],
          isActive: true,
          name: 'E2E Active Category',
          slug: 'e2e-active-category',
          sortOrder: 1,
        },
        {
          description: 'Deterministic inactive category for mutable E2E tests.',
          id: E2E_FIXTURE_IDS.categories[1],
          isActive: false,
          name: 'E2E Inactive Category',
          slug: 'e2e-inactive-category',
          sortOrder: 2,
        },
      ],
    });

    await transaction.product.createMany({
      data: E2E_PRODUCT_FIXTURES.map((product) => ({
        categoryId: product.categoryId,
        compareAtPriceMinor: null,
        currency: 'PEN',
        description: `${product.name} is deterministic test-only catalog data.`,
        featured: false,
        id: product.id,
        name: product.name,
        priceMinor: product.priceMinor,
        shortDescription: `${product.name} fixture.`,
        sku: product.sku,
        slug: product.slug,
        status: product.status,
      })),
    });

    await transaction.mediaAsset.createMany({
      data: E2E_PRODUCT_FIXTURES.map((product) => ({
        alt: `Deterministic placeholder for ${product.name}`,
        desktopUrl: '/e2e/placeholder.png',
        height: 900,
        id: `media-${product.id}`,
        mimeType: 'image/png',
        mobileUrl: '/e2e/placeholder.png',
        provider: MediaProvider.MOCK,
        width: 900,
      })),
    });

    await transaction.productImage.createMany({
      data: E2E_PRODUCT_FIXTURES.map((product) => ({
        id: `image-${product.id}`,
        isPrimary: true,
        mediaAssetId: `media-${product.id}`,
        position: 0,
        productId: product.id,
      })),
    });

    await transaction.inventory.createMany({
      data: E2E_PRODUCT_FIXTURES.map((product) => ({
        allowBackorder: false,
        id: `inventory-${product.id}`,
        lowStockThreshold: 5,
        productId: product.id,
        reserved: 0,
        stockOnHand: product.stockOnHand,
        trackStock: true,
        version: 0,
      })),
    });

    await transaction.inventoryMovement.createMany({
      data: E2E_PRODUCT_FIXTURES.filter(
        (product) => product.stockOnHand > 0,
      ).map((product) => ({
        id: `movement-${product.id}`,
        note: 'Deterministic E2E initial stock.',
        productId: product.id,
        quantityDelta: product.stockOnHand,
        referenceId: product.sku,
        referenceType: 'E2E_FIXTURE',
        reservedDelta: 0,
        type: InventoryMovementType.INITIAL_STOCK,
      })),
    });

    const historicalProduct = E2E_PRODUCT_FIXTURES.find(
      (product) => product.id === E2E_FIXTURE_IDS.products[5],
    );

    if (!historicalProduct) {
      throw new E2eSafetyError(
        'The historical E2E product fixture is not defined.',
      );
    }

    await transaction.order.create({
      data: {
        currency: 'PEN',
        customerEmail: 'customer@tienda-izipay-e2e.invalid',
        customerFirstName: 'E2E',
        customerLastName: 'Customer Fixture',
        customerPhone: '+51000000000',
        deliveryFeeMinor: 0,
        deliveryMode: DeliveryMode.PICKUP,
        id: E2E_FIXTURE_IDS.historicalOrder,
        items: {
          create: {
            id: E2E_FIXTURE_IDS.historicalOrderItem,
            productId: historicalProduct.id,
            productName: historicalProduct.name,
            quantity: 1,
            sku: historicalProduct.sku,
            subtotalMinor: historicalProduct.priceMinor,
            unitPriceMinor: historicalProduct.priceMinor,
          },
        },
        orderNumber: 'E2E-HISTORICAL-0001',
        status: OrderStatus.PAID,
        subtotalMinor: historicalProduct.priceMinor,
        totalMinor: historicalProduct.priceMinor,
      },
    });
  });
}
