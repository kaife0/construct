import { Reveal } from "@/components/reveal";
import { PlanCard } from "@/components/plan-card";
import type { Plan } from "@/lib/content";

/** Reusable ready-made-plans card grid — used on Home (preview) and Services (full). */
export function PlansGrid({ plans, lgCols = 4 }: { plans: Plan[]; lgCols?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${lgCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {plans.map((p, i) => (
        <Reveal key={p.slug} delay={(i % lgCols) * 0.05}>
          <PlanCard plan={p} />
        </Reveal>
      ))}
    </div>
  );
}
