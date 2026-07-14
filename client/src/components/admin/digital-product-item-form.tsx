"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { TextField, TextAreaField, NumberField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { BackLink } from "@/components/admin/back-link";
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
  const [price, setPrice] = useState(existing?.price ?? 0);
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
      price: price > 0 ? price : undefined,
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
    <div>
      <BackLink href={listHref} label="Products" />
      <h1 className="display mt-4 text-3xl">{editing ? "Edit product" : "New product"}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid max-w-2xl gap-6">
        <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Modern Kitchen CAD Block" required />
        <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
        <ImageUploader label="Image" value={image} folder="digital-products" onChange={setImage} required />
        <NumberField label="Price" suffix="₹" value={price} onChange={setPrice} step={1} />

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
            {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
          </button>
          <Link href={listHref} className="text-sm font-medium text-graphite hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
