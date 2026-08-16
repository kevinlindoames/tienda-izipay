import Link from "next/link";
import type { ReactElement } from "react";

import { ResponsiveMedia } from "@/components/ui/responsive-media";

import type { Product } from "../types/catalog.types";
import { formatMoney } from "../utils/format-money";
import { getPrimaryProductImage } from "../utils/product-media";

interface ProductCardProps {
  product: Product;
  imageLoading?: "eager" | "lazy";
}

const availabilityLabels: Record<Product["availability"], string> = {
  "in-stock": "Disponible",
  "low-stock": "Pocas unidades",
  "out-of-stock": "Agotado",
};

export function ProductCard({
  product,
  imageLoading,
}: ProductCardProps): ReactElement {
  const primaryImage = getPrimaryProductImage(product.images);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <Link
        href={`/productos/${product.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand)]"
        aria-label={`Ver ${product.name}`}
      >
        <ResponsiveMedia
          desktopSrc={primaryImage?.desktopSrc}
          mobileSrc={primaryImage?.mobileSrc}
          alt={primaryImage?.alt ?? `Imagen pendiente de ${product.name}`}
          loading={imageLoading}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="aspect-square rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {product.sku}
          </p>
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            {availabilityLabels[product.availability]}
          </p>
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          <Link
            href={`/productos/${product.slug}`}
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            {product.name}
          </Link>
        </h2>

        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            {product.compareAtPrice ? (
              <p className="text-xs text-[var(--color-text-muted)] line-through">
                {formatMoney(product.compareAtPrice)}
              </p>
            ) : null}
            <p className="text-lg font-semibold text-[var(--color-text)]">
              {formatMoney(product.price)}
            </p>
          </div>

          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
          >
            Ver producto
          </Link>
        </div>
      </div>
    </article>
  );
}
