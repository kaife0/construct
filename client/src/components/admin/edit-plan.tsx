"use client";

import { getPlan, type PlanRecord } from "@/lib/admin-api";
import { PlanForm } from "@/components/admin/plan-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditPlan({ id }: { id: string }) {
  const { data, error } = useResource<PlanRecord>(id, getPlan, "Could not load plan.");
  return (
    <ResourceLoader data={data} error={error}>
      {(plan) => <PlanForm existing={plan} />}
    </ResourceLoader>
  );
}
