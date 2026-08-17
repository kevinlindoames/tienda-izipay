import Link from "next/link";
import type { ReactElement } from "react";

import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { toCartProductSnapshot } from "@/features/cart/utils/cart-product";

import type { Product } from "../types/catalog.types";
import { formatMoney } from "../utils/format-money";
import { getPrimaryProductImage } from "../utils/product-media";

interface ProductDetailProps {
  product: Product;
}

const availabilityLabels: Record<Product["availability"], string> = {
  "in-stock": "Disponible",
  "low-stock": "Pocas unidades",
  "out-of-stock": "Agotado temporalmente",
};

export function ProductDetail({ product }: ProductDetailProps): ReactElement {
  const primaryImage = getPrimaryProductImage(product.images);

  const secondaryImages = [...product.images]
    .filter((image) => image.id !== primaryImage?.id)
    .sort((left, right) => left.position - right.position);

  const cartProduct = toCartProductSnapshot(product);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <ResponsiveMedia
          desktopSrc={primaryImage?.desktopSrc}
          mobileSrc={primaryImage?.mobileSrc}
          alt={primaryImage?.alt ?? `Imagen pendiente de ${product.name}`}
          sizes="(max-width: 1023px) 100vw, 50vw"
          priority
          className="aspect-square"
        />

        {secondaryImages.length > 0 ? (
          <div
            className="mt-4 grid grid-cols-2 gap-4"
            aria-label="Galeria secundaria"
          >
            {secondaryImages.map((image) => (
              <ResponsiveMedia
                key={image.id}
                desktopSrc={image.desktopSrc}
                mobileSrc={image.mobileSrc}
                alt={image.alt}
                sizes="(max-width: 1023px) 50vw, 25vw"
                className="aspect-square"
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="self-start lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
        <Link
          href="/productos"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          &larr; Volver al catalogo
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {product.sku}
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl">
          {product.name}
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
          {product.shortDescription}
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-4">
          <p className="text-3xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            {formatMoney(product.price)}
          </p>

          {product.compareAtPrice ? (
            <p className="pb-1 text-base text-[var(--color-text-muted)] line-through">
              {formatMoney(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">
          {availabilityLabels[product.availability]}
        </p>

        <div className="mt-8">
          <AddToCartButton
            product={cartProduct}
            disabled={product.availability === "out-of-stock"}
          />
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text)]">
            Descripcion
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
            {product.description}
          </p>
        </div>

        <div className="mt-8 rounded-[var(--radius-card)] bg-[var(--color-surface-soft)] p-5">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            El precio y disponibilidad mostrados provienen del catalogo actual.
            Antes del checkout, NestJS volvera a validar precio y stock.
          </p>
        </div>
      </div>
    </div>
  );
}
