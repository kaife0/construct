"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, NumberField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { createDigitalProduct, updateDigitalProduct, type DigitalProductRecord } from "@/lib/admin-api";

export function DigitalProductItemForm({
  categoryId,
  existing,
}: {
  categoryId: string;
  existing?: DigitalProductRecord;
}) {
  const router = useRouter();
  const editing = Boolean(existing);
  const listHref = `/admin/digital-products/${categoryId}/products`;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [price, setPrice] = useState(existing?.price ?? 0);
  const [features, setFeatures] = useState((existing?.features ?? []).join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    const payload = {
      categoryId,
      title: title.trim(),
      description: description.trim(),
      image,
      images,
      price: price > 0 ? price : undefined,
      features: features.split("\n").map((f) => f.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updateDigitalProduct(existing._id, payload);
      } else {
        await createDigitalProduct(payload);
      }
      router.push(listHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref={listHref}
      backLabel="Products"
      heading={editing ? "Edit product" : "New product"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create product"}
      cancelHref={listHref}
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Modern Kitchen CAD Block" required />
      <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
      <ImageUploader label="Image" value={image} folder="digital-products" onChange={setImage} required />
      <MultiImageUploader value={images} folder="digital-products" onChange={setImages} />
      <NumberField label="Price" suffix="₹" value={price} onChange={setPrice} step={1} />
      <TextAreaField
        label="Features"
        value={features}
        onChange={setFeatures}
        rows={5}
        hint="One per line. Shown as tags on the product's detail page."
        placeholder={"DWG format\nEditable layers\nMetric units"}
      />
    </AdminFormShell>
  );
}
