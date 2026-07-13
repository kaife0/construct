"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { listPlans, deletePlan, type PlanRecord } from "@/lib/admin-api";
import { BackLink } from "@/components/admin/back-link";

export function PlansList() {
  const [plans, setPlans] = useState<PlanRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listPlans()
      .then(setPlans)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load plans."));
  };

  useEffect(load, []);

  const onDelete = async (plan: PlanRecord) => {
    if (!confirm(`Delete "${plan.title}"? This cannot be undone.`)) return;
    setDeletingId(plan._id);
    try {
      await deletePlan(plan._id);
      setPlans((prev) => prev?.filter((p) => p._id !== plan._id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <BackLink href="/admin" label="Dashboard" />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="label">Content</p>
          <h1 className="display mt-3 text-3xl">Ready-made Plans</h1>
        </div>
        <Link
          href="/admin/plans/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper"
        >
          <Plus size={16} /> New plan
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-accent-strong">{error}</p>}

      {plans === null && !error ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {plans?.length === 0 && (
            <p className="py-8 text-sm text-graphite">No plans yet. Create your first one.</p>
          )}
          {plans?.map((plan) => (
            <div key={plan._id} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                {plan.image && (
                  <Image src={plan.image} alt="" fill unoptimized sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{plan.title}</p>
                <p className="truncate text-sm text-graphite">
                  {plan.config} · {plan.area} sqft{plan.tag ? ` · ${plan.tag}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/plans/${plan._id}/edit`}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-ink hover:text-ink"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(plan)}
                  disabled={deletingId === plan._id}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deletingId === plan._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
