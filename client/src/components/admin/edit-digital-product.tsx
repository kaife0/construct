"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDigitalProductCategory, type DigitalProductCategoryRecord } from "@/lib/admin-api";
import { DigitalProductForm } from "@/components/admin/digital-product-form";

export function EditDigitalProduct({ id }: { id: string }) {
  const [category, setCategory] = useState<DigitalProductCategoryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDigitalProductCategory(id)
      .then(setCategory)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load category."));
  }, [id]);

  if (error) return <p className="text-sm text-accent-strong">{error}</p>;
  if (!category)
    return (
      <div className="flex items-center gap-2 text-sm text-graphite">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );

  return <DigitalProductForm existing={category} />;
}
