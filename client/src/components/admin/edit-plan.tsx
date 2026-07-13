"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getPlan, type PlanRecord } from "@/lib/admin-api";
import { PlanForm } from "@/components/admin/plan-form";

export function EditPlan({ id }: { id: string }) {
  const [plan, setPlan] = useState<PlanRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlan(id)
      .then(setPlan)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load plan."));
  }, [id]);

  if (error) return <p className="text-sm text-accent-strong">{error}</p>;
  if (!plan)
    return (
      <div className="flex items-center gap-2 text-sm text-graphite">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );

  return <PlanForm existing={plan} />;
}
