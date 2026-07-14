"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { TextField, TextAreaField, CheckboxField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { BackLink } from "@/components/admin/back-link";
import {
  createDigitalProductCategory,
  updateDigitalProductCategory,
  type DigitalProductCategoryRecord,
} from "@/lib/admin-api";

export function DigitalProductForm({ existing }: { existing?: DigitalProductCategoryRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [showPlansCatalog, setShowPlansCatalog] = useState(existing?.showPlansCatalog ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !summary.trim() || !description.trim()) {
      setError("Title, summary and description are required.");
      return;
    }
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      description: description.trim(),
      image,
      showPlansCatalog,
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updateDigitalProductCategory(existing._id, payload);
      } else {
        await createDigitalProductCategory(payload);
      }
      router.push("/admin/digital-products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <div>
      <BackLink href="/admin/digital-products" label="Digital Products" />
      <h1 className="display mt-4 text-3xl">{editing ? "Edit category" : "New category"}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid max-w-2xl gap-6">
        <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Ready-made House Plans" required />
        <TextField label="Summary" value={summary} onChange={setSummary} placeholder="One-line summary shown on cards" required />
        <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
        <ImageUploader label="Image" value={image} folder="digital-products" onChange={setImage} required />
        <CheckboxField
          label="Show the ready-made plans catalog on this category's page"
          checked={showPlansCatalog}
          onChange={setShowPlansCatalog}
          hint="Enable this for the category that should display the Plans list (managed under Ready-made Plans)."
        />

        {error && (
          <div className="flex items-start gap-2 border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-strong">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
          </button>
          <Link href="/admin/digital-products" className="text-sm font-medium text-graphite hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
