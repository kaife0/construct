"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, CheckboxField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
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
    <AdminFormShell
      backHref="/admin/digital-products"
      backLabel="Digital Products"
      heading={editing ? "Edit category" : "New category"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create category"}
      cancelHref="/admin/digital-products"
    >
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
    </AdminFormShell>
  );
}
