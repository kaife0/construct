import { CardGrid } from "@/components/card-grid";
import { CategoryCard } from "@/components/digital-products/category-card";
import type { DigitalProductCategory } from "@/lib/content";

export function CategoryGrid({ categories, lgCols = 3 }: { categories: DigitalProductCategory[]; lgCols?: 3 | 4 }) {
  return <CardGrid items={categories} lgCols={lgCols} getKey={(c) => c.slug} renderItem={(c) => <CategoryCard category={c} />} />;
}
