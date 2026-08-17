import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { ProductDetail, catalogRepository } from "@/features/catalog";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalogRepository.getBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const product = await catalogRepository.getBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Container className="py-10 sm:py-14 lg:py-16">
        <ProductDetail product={product} />
      </Container>
    </main>
  );
}
