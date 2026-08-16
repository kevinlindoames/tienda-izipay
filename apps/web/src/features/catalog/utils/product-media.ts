import type { ProductImage } from "../types/catalog.types";

export function getPrimaryProductImage(
  images: ProductImage[],
): ProductImage | null {
  if (images.length === 0) {
    return null;
  }

  return (
    images.find((image) => image.isPrimary) ??
    [...images].sort((left, right) => left.position - right.position)[0] ??
    null
  );
}
