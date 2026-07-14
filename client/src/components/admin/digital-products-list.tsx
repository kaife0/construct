"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  listDigitalProductCategories,
  deleteDigitalProductCategory,
  type DigitalProductCategoryRecord,
} from "@/lib/admin-api";
import { BackLink } from "@/components/admin/back-link";

export function DigitalProductsList() {
  const [categories, setCategories] = useState<DigitalProductCategoryRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listDigitalProductCategories()
      .then(setCategories)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load categories."));
  };

  useEffect(load, []);

  const onDelete = async (category: DigitalProductCategoryRecord) => {
    if (!confirm(`Delete "${category.title}"? This cannot be undone.`)) return;
    setDeletingId(category._id);
    try {
      await deleteDigitalProductCategory(category._id);
      setCategories((prev) => prev?.filter((c) => c._id !== category._id) ?? null);
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
          <h1 className="display mt-3 text-3xl">Digital Products</h1>
        </div>
        <Link
          href="/admin/digital-products/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper"
        >
          <Plus size={16} /> New category
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-accent-strong">{error}</p>}

      {categories === null && !error ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {categories?.length === 0 && (
            <p className="py-8 text-sm text-graphite">No categories yet. Create your first one.</p>
          )}
          {categories?.map((category) => (
            <div key={category._id} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                {category.image && (
                  <Image src={category.image} alt="" fill unoptimized sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{category.title}</p>
                <p className="truncate text-sm text-graphite">
                  {category.summary}
                  {category.showPlansCatalog && <span className="label ml-2 text-[9px] text-accent-strong">SHOWS PLANS</span>}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/digital-products/${category._id}/edit`}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-ink hover:text-ink"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(category)}
                  disabled={deletingId === category._id}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deletingId === category._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
