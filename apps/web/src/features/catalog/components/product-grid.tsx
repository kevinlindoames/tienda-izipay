import type { ReactElement } from "react";

import type { Product } from "../types/catalog.types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps): ReactElement {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="product-grid"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          imageLoading={index === 0 ? "eager" : undefined}
        />
      ))}
    </div>
  );
}
