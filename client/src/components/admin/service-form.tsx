"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { createService, updateService, type ServiceRecord } from "@/lib/admin-api";

export function ServiceForm({ existing }: { existing?: ServiceRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [deliverables, setDeliverables] = useState((existing?.deliverables ?? []).join("\n"));
  const [image, setImage] = useState(existing?.image ?? "");
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
      deliverables: deliverables.split("\n").map((s) => s.trim()).filter(Boolean),
      image,
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updateService(existing._id, payload);
      } else {
        await createService(payload);
      }
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref="/admin/services"
      backLabel="Services"
      heading={editing ? "Edit service" : "New service"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create service"}
      cancelHref="/admin/services"
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. House Planning" required />
      <TextField label="Summary" value={summary} onChange={setSummary} placeholder="One-line summary shown on cards" required />
      <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
      <TextAreaField
        label="What's included"
        value={deliverables}
        onChange={setDeliverables}
        rows={10}
        hint="One per line. Shown as a checklist on the service's detail page."
        placeholder={"Residential planning\nCommercial planning\nVastu-based planning\nCorner-plot planning"}
      />
      <ImageUploader label="Image" value={image} folder="services" onChange={setImage} required />
    </AdminFormShell>
  );
}
