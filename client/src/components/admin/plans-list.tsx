"use client";

import { listPlans, deletePlan, type PlanRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function PlansList() {
  return (
    <AdminResourceList<PlanRecord>
      title="Ready-made Plans"
      newHref="/admin/plans/new"
      newLabel="New plan"
      emptyLabel="No plans yet. Create your first one."
      list={listPlans}
      remove={deletePlan}
      editHref={(p) => `/admin/plans/${p._id}/edit`}
      getId={(p) => p._id}
      getImage={(p) => p.image}
      getTitle={(p) => p.title}
      renderSubtitle={(p) => `${p.config} · ${p.area} sqft${p.tag ? ` · ${p.tag}` : ""}`}
    />
  );
}
