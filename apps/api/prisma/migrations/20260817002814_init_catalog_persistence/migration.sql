-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaProvider" AS ENUM ('MOCK', 'SUPABASE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('INITIAL_STOCK', 'ADJUSTMENT', 'RESERVATION', 'RELEASE', 'SALE', 'RETURN', 'CANCELLATION');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "sku" VARCHAR(80) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "shortDescription" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "priceMinor" INTEGER NOT NULL,
    "compareAtPriceMinor" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'PEN',
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "provider" "MediaProvider" NOT NULL DEFAULT 'MOCK',
    "bucket" VARCHAR(120),
    "storageKey" VARCHAR(500),
    "desktopUrl" TEXT NOT NULL,
    "mobileUrl" TEXT,
    "alt" VARCHAR(500) NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" VARCHAR(120),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stockOnHand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "trackStock" BOOLEAN NOT NULL DEFAULT true,
    "allowBackorder" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantityDelta" INTEGER NOT NULL,
    "reservedDelta" INTEGER NOT NULL DEFAULT 0,
    "referenceType" VARCHAR(80),
    "referenceId" VARCHAR(160),
    "note" VARCHAR(500),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_isActive_sortOrder_idx" ON "categories"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categoryId_status_idx" ON "products"("categoryId", "status");

-- CreateIndex
CREATE INDEX "products_status_featured_idx" ON "products"("status", "featured");

-- CreateIndex
CREATE INDEX "media_assets_provider_idx" ON "media_assets"("provider");

-- CreateIndex
CREATE INDEX "media_assets_storageKey_idx" ON "media_assets"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "product_images_productId_position_key" ON "product_images"("productId", "position");

-- CreateIndex
CREATE INDEX "product_images_productId_isPrimary_idx" ON "product_images"("productId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "product_images_productId_mediaAssetId_key" ON "product_images"("productId", "mediaAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_productId_key" ON "inventories"("productId");

-- CreateIndex
CREATE INDEX "inventory_movements_productId_createdAt_idx" ON "inventory_movements"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_movements_referenceType_referenceId_idx" ON "inventory_movements"("referenceType", "referenceId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "media_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Application integrity constraints

ALTER TABLE "categories"
ADD CONSTRAINT "categories_sortOrder_nonnegative_check"
CHECK ("sortOrder" >= 0);

ALTER TABLE "products"
ADD CONSTRAINT "products_priceMinor_nonnegative_check"
CHECK ("priceMinor" >= 0);

ALTER TABLE "products"
ADD CONSTRAINT "products_compareAtPriceMinor_nonnegative_check"
CHECK (
    "compareAtPriceMinor" IS NULL
    OR "compareAtPriceMinor" >= 0
);

ALTER TABLE "products"
ADD CONSTRAINT "products_currency_format_check"
CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "media_assets"
ADD CONSTRAINT "media_assets_width_positive_check"
CHECK (
    "width" IS NULL
    OR "width" > 0
);

ALTER TABLE "media_assets"
ADD CONSTRAINT "media_assets_height_positive_check"
CHECK (
    "height" IS NULL
    OR "height" > 0
);

ALTER TABLE "product_images"
ADD CONSTRAINT "product_images_position_nonnegative_check"
CHECK ("position" >= 0);

CREATE UNIQUE INDEX "product_images_one_primary_per_product_key"
ON "product_images" ("productId")
WHERE "isPrimary" = true;

ALTER TABLE "inventories"
ADD CONSTRAINT "inventories_stockOnHand_nonnegative_check"
CHECK ("stockOnHand" >= 0);

ALTER TABLE "inventories"
ADD CONSTRAINT "inventories_reserved_nonnegative_check"
CHECK ("reserved" >= 0);

ALTER TABLE "inventories"
ADD CONSTRAINT "inventories_reserved_stock_policy_check"
CHECK (
    "allowBackorder" = true
    OR "reserved" <= "stockOnHand"
);

ALTER TABLE "inventories"
ADD CONSTRAINT "inventories_lowStockThreshold_nonnegative_check"
CHECK ("lowStockThreshold" >= 0);

ALTER TABLE "inventories"
ADD CONSTRAINT "inventories_version_nonnegative_check"
CHECK ("version" >= 0);

ALTER TABLE "inventory_movements"
ADD CONSTRAINT "inventory_movements_nonzero_change_check"
CHECK (
    "quantityDelta" <> 0
    OR "reservedDelta" <> 0
);
