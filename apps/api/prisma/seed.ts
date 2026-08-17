import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import {
  InventoryMovementType,
  MediaProvider,
  PrismaClient,
  ProductStatus,
} from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const categories = [
  {
    id: 'category-video',
    slug: 'video',
    name: 'Video',
    description: 'C\u00e1maras y soluciones visuales provisionales.',
    sortOrder: 1,
  },
  {
    id: 'category-audio',
    slug: 'audio',
    name: 'Audio',
    description: 'Micr\u00f3fonos y audio para distintos espacios.',
    sortOrder: 2,
  },
  {
    id: 'category-accessories',
    slug: 'accesorios',
    name: 'Accesorios',
    description: 'Complementos para completar una configuraci\u00f3n.',
    sortOrder: 3,
  },
] as const;

const products = [
  {
    id: 'product-camera-pro',
    slug: 'camara-pro-4k',
    sku: 'VID-001',
    name: 'C\u00e1mara Pro 4K',
    shortDescription:
      'C\u00e1mara provisional para videollamadas y creaci\u00f3n de contenido.',
    description:
      'Producto provisional preparado para validar la arquitectura del cat\u00e1logo, la ficha de producto y la futura conexi\u00f3n con la API.',
    priceMinor: 129900,
    compareAtPriceMinor: 149900,
    featured: true,
    categorySlug: 'video',
    stockOnHand: 20,
    imageId: 'catalog-image-1',
    mediaId: 'media-catalog-image-1',
    desktopUrl: 'https://picsum.photos/seed/camera-pro-4k/900/900',
    mobileUrl: 'https://picsum.photos/seed/camera-pro-4k/700/700',
    alt: 'Fotograf\u00eda referencial provisional de C\u00e1mara Pro 4K',
  },
  {
    id: 'product-camera-compact',
    slug: 'camara-compacta-hd',
    sku: 'VID-002',
    name: 'C\u00e1mara Compacta HD',
    shortDescription:
      'Formato compacto para escritorios y espacios de trabajo personales.',
    description:
      'Ficha provisional de una c\u00e1mara compacta pensada para comprobar listados, filtros y navegaci\u00f3n por slug.',
    priceMinor: 79900,
    compareAtPriceMinor: null,
    featured: false,
    categorySlug: 'video',
    stockOnHand: 3,
    imageId: 'catalog-image-2',
    mediaId: 'media-catalog-image-2',
    desktopUrl: 'https://picsum.photos/seed/camera-compact-hd/900/900',
    mobileUrl: 'https://picsum.photos/seed/camera-compact-hd/700/700',
    alt: 'Fotograf\u00eda referencial provisional de C\u00e1mara Compacta HD',
  },
  {
    id: 'product-streaming-kit',
    slug: 'kit-streaming-studio',
    sku: 'VID-003',
    name: 'Kit Streaming Studio',
    shortDescription:
      'Conjunto provisional para una configuraci\u00f3n audiovisual completa.',
    description:
      'Producto compuesto provisional utilizado para validar precios, contenido y comportamiento responsive de la ficha.',
    priceMinor: 169900,
    compareAtPriceMinor: null,
    featured: true,
    categorySlug: 'video',
    stockOnHand: 20,
    imageId: 'catalog-image-3',
    mediaId: 'media-catalog-image-3',
    desktopUrl: 'https://picsum.photos/seed/streaming-studio/900/900',
    mobileUrl: 'https://picsum.photos/seed/streaming-studio/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Kit Streaming Studio',
  },
  {
    id: 'product-microphone',
    slug: 'microfono-usb-studio',
    sku: 'AUD-001',
    name: 'Micr\u00f3fono USB Studio',
    shortDescription:
      'Micr\u00f3fono provisional con conexi\u00f3n directa para reuniones y contenido.',
    description:
      'Ficha provisional para representar un producto de audio dentro del cat\u00e1logo y preparar el futuro contrato del backend.',
    priceMinor: 45900,
    compareAtPriceMinor: null,
    featured: true,
    categorySlug: 'audio',
    stockOnHand: 20,
    imageId: 'catalog-image-4',
    mediaId: 'media-catalog-image-4',
    desktopUrl: 'https://picsum.photos/seed/microphone-studio/900/900',
    mobileUrl: 'https://picsum.photos/seed/microphone-studio/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Micr\u00f3fono USB Studio',
  },
  {
    id: 'product-speaker',
    slug: 'speaker-conference',
    sku: 'AUD-002',
    name: 'Speaker Conference',
    shortDescription:
      'Audio provisional para salas peque\u00f1as y reuniones de equipo.',
    description:
      'Producto de audio provisional para validar la categor\u00eda, la b\u00fasqueda y la ficha individual.',
    priceMinor: 64900,
    compareAtPriceMinor: null,
    featured: false,
    categorySlug: 'audio',
    stockOnHand: 0,
    imageId: 'catalog-image-5',
    mediaId: 'media-catalog-image-5',
    desktopUrl: 'https://picsum.photos/seed/speaker-conference/900/900',
    mobileUrl: 'https://picsum.photos/seed/speaker-conference/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Speaker Conference',
  },
  {
    id: 'product-hub',
    slug: 'hub-usb-c-connect',
    sku: 'ACC-001',
    name: 'Hub USB-C Connect',
    shortDescription:
      'Hub provisional para ampliar conexiones en una estaci\u00f3n de trabajo.',
    description:
      'Accesorio provisional preparado para validar cat\u00e1logo, ordenamiento por precio y p\u00e1gina de detalle.',
    priceMinor: 24900,
    compareAtPriceMinor: null,
    featured: false,
    categorySlug: 'accesorios',
    stockOnHand: 20,
    imageId: 'catalog-image-6',
    mediaId: 'media-catalog-image-6',
    desktopUrl: 'https://picsum.photos/seed/usb-c-hub/900/900',
    mobileUrl: 'https://picsum.photos/seed/usb-c-hub/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Hub USB-C Connect',
  },
  {
    id: 'product-stand',
    slug: 'soporte-escritorio-flex',
    sku: 'ACC-002',
    name: 'Soporte Escritorio Flex',
    shortDescription:
      'Soporte provisional para organizar una configuraci\u00f3n de escritorio.',
    description:
      'Accesorio provisional utilizado para probar paginaci\u00f3n y presentaci\u00f3n de contenido.',
    priceMinor: 18900,
    compareAtPriceMinor: null,
    featured: false,
    categorySlug: 'accesorios',
    stockOnHand: 20,
    imageId: 'catalog-image-7',
    mediaId: 'media-catalog-image-7',
    desktopUrl: 'https://picsum.photos/seed/desk-stand-flex/900/900',
    mobileUrl: 'https://picsum.photos/seed/desk-stand-flex/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Soporte Escritorio Flex',
  },
  {
    id: 'product-light',
    slug: 'luz-led-work',
    sku: 'ACC-003',
    name: 'Luz LED Work',
    shortDescription:
      'Iluminaci\u00f3n provisional para videollamadas y espacios de trabajo.',
    description:
      'Producto provisional para completar el volumen inicial del cat\u00e1logo y comprobar la segunda p\u00e1gina de resultados.',
    priceMinor: 29900,
    compareAtPriceMinor: null,
    featured: false,
    categorySlug: 'accesorios',
    stockOnHand: 3,
    imageId: 'catalog-image-8',
    mediaId: 'media-catalog-image-8',
    desktopUrl: 'https://picsum.photos/seed/led-work-light/900/900',
    mobileUrl: 'https://picsum.photos/seed/led-work-light/700/700',
    alt: 'Fotograf\u00eda referencial provisional de Luz LED Work',
  },
] as const;

async function main(): Promise<void> {
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });
  }

  for (const data of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: {
        slug: data.categorySlug,
      },
    });

    const product = await prisma.product.upsert({
      where: {
        sku: data.sku,
      },
      update: {
        slug: data.slug,
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        priceMinor: data.priceMinor,
        compareAtPriceMinor: data.compareAtPriceMinor,
        currency: 'PEN',
        status: ProductStatus.ACTIVE,
        featured: data.featured,
        categoryId: category.id,
      },
      create: {
        id: data.id,
        slug: data.slug,
        sku: data.sku,
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        priceMinor: data.priceMinor,
        compareAtPriceMinor: data.compareAtPriceMinor,
        currency: 'PEN',
        status: ProductStatus.ACTIVE,
        featured: data.featured,
        categoryId: category.id,
      },
    });

    const media = await prisma.mediaAsset.upsert({
      where: {
        id: data.mediaId,
      },
      update: {
        provider: MediaProvider.MOCK,
        desktopUrl: data.desktopUrl,
        mobileUrl: data.mobileUrl,
        alt: data.alt,
      },
      create: {
        id: data.mediaId,
        provider: MediaProvider.MOCK,
        desktopUrl: data.desktopUrl,
        mobileUrl: data.mobileUrl,
        alt: data.alt,
      },
    });

    await prisma.productImage.upsert({
      where: {
        id: data.imageId,
      },
      update: {
        productId: product.id,
        mediaAssetId: media.id,
        position: 1,
        isPrimary: true,
      },
      create: {
        id: data.imageId,
        productId: product.id,
        mediaAssetId: media.id,
        position: 1,
        isPrimary: true,
      },
    });

    const existingInventory = await prisma.inventory.findUnique({
      where: {
        productId: product.id,
      },
    });

    if (!existingInventory) {
      await prisma.inventory.create({
        data: {
          productId: product.id,
          stockOnHand: data.stockOnHand,
          reserved: 0,
          lowStockThreshold: 5,
          trackStock: true,
          allowBackorder: false,
        },
      });
    }

    if (data.stockOnHand > 0) {
      const movementId = `seed-initial-${product.id}`;

      await prisma.inventoryMovement.upsert({
        where: {
          id: movementId,
        },
        update: {},
        create: {
          id: movementId,
          productId: product.id,
          type: InventoryMovementType.INITIAL_STOCK,
          quantityDelta: data.stockOnHand,
          reservedDelta: 0,
          referenceType: 'SEED',
          referenceId: product.sku,
          note: 'Initial development seed stock.',
        },
      });
    }
  }

  const categoryCount = await prisma.category.count();

  const productCount = await prisma.product.count();

  console.log(
    `Seed complete: ${categoryCount} categories, ${productCount} products.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
