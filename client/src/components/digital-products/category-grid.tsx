import { Reveal } from "@/components/reveal";
import { CategoryCard } from "@/components/digital-products/category-card";
import type { DigitalProductCategory } from "@/lib/content";

export function CategoryGrid({ categories, lgCols = 3 }: { categories: DigitalProductCategory[]; lgCols?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${lgCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {categories.map((c, i) => (
        <Reveal key={c.slug} delay={(i % lgCols) * 0.05}>
          <CategoryCard category={c} />
        </Reveal>
      ))}
    </div>
  );
}
