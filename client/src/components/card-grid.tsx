import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/** Shared 2-up/3-or-4-up responsive card grid with staggered reveal — used by every card catalog (Services, Plans, Digital Products). */
export function CardGrid<T>({
  items,
  lgCols = 3,
  getKey,
  renderItem,
}: {
  items: T[];
  lgCols?: 3 | 4;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${lgCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {items.map((item, i) => (
        <Reveal key={getKey(item)} delay={(i % lgCols) * 0.05}>
          {renderItem(item)}
        </Reveal>
      ))}
    </div>
  );
}
