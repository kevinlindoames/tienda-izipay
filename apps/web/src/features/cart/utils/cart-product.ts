import type { Product } from "@/features/catalog/types/catalog.types";
import { getPrimaryProductImage } from "@/features/catalog/utils/product-media";

import type { CartProductSnapshot } from "../types/cart.types";

export function toCartProductSnapshot(product: Product): CartProductSnapshot {
  const primaryImage = getPrimaryProductImage(product.images);

  return {
    productId: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    unitPrice: {
      minorAmount: product.price.minorAmount,
      currency: product.price.currency,
    },
    image: primaryImage
      ? {
          desktopSrc: primaryImage.desktopSrc,
          mobileSrc: primaryImage.mobileSrc,
          alt: primaryImage.alt,
          width: primaryImage.width,
          height: primaryImage.height,
        }
      : null,
  };
}
