import { CardGrid } from "@/components/card-grid";
import { ProductCard } from "@/components/digital-products/product-card";
import type { DigitalProduct } from "@/lib/content";

export function ProductGrid({
  products,
  categorySlug,
  lgCols = 3,
}: {
  products: DigitalProduct[];
  categorySlug: string;
  lgCols?: 3 | 4;
}) {
  return (
    <CardGrid
      items={products}
      lgCols={lgCols}
      getKey={(p) => p.slug}
      renderItem={(p) => <ProductCard product={p} categorySlug={categorySlug} />}
    />
  );
}
