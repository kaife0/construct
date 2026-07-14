import { CardGrid } from "@/components/card-grid";
import { PlanCard } from "@/components/plan-card";
import type { Plan } from "@/lib/content";

export function PlansGrid({ plans, lgCols = 4 }: { plans: Plan[]; lgCols?: 3 | 4 }) {
  return <CardGrid items={plans} lgCols={lgCols} getKey={(p) => p.slug} renderItem={(p) => <PlanCard plan={p} />} />;
}
