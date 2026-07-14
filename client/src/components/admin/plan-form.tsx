"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, NumberField, SelectField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { createPlan, updatePlan, type PlanRecord } from "@/lib/admin-api";

const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map(
  (v) => ({ value: v, label: v })
);

export function PlanForm({ existing }: { existing?: PlanRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [config, setConfig] = useState(existing?.config ?? "");
  const [area, setArea] = useState(existing?.area ?? 1000);
  const [beds, setBeds] = useState(existing?.beds ?? 2);
  const [baths, setBaths] = useState(existing?.baths ?? 2);
  const [floors, setFloors] = useState(existing?.floors ?? 1);
  const [facing, setFacing] = useState(existing?.facing ?? "East");
  const [tag, setTag] = useState(existing?.tag ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !config.trim() || !facing.trim() || !description.trim()) {
      setError("Title, configuration, facing and description are required.");
      return;
    }
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    const payload = {
      title: title.trim(),
      config: config.trim(),
      area,
      beds,
      baths,
      floors,
      facing: facing.trim(),
      tag: tag.trim() || undefined,
      image,
      description: description.trim(),
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updatePlan(existing._id, payload);
      } else {
        await createPlan(payload);
      }
      router.push("/admin/plans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref="/admin/plans"
      backLabel="Ready-made Plans"
      heading={editing ? "Edit plan" : "New plan"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create plan"}
      cancelHref="/admin/plans"
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Modern 3 BHK Villa" required />
      <TextField label="Configuration" value={config} onChange={setConfig} placeholder="e.g. 3 BHK · G+1" required />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <NumberField label="Area" suffix="sqft" value={area} onChange={setArea} step={50} required />
        <NumberField label="Beds" value={beds} onChange={setBeds} required />
        <NumberField label="Baths" value={baths} onChange={setBaths} required />
        <NumberField label="Floors" value={floors} onChange={setFloors} min={1} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Facing" value={facing} onChange={setFacing} options={facingOptions} required />
        <TextField label="Tag" value={tag} onChange={setTag} placeholder="e.g. Popular, New (optional)" />
      </div>

      <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
      <ImageUploader label="Image" value={image} folder="plans" onChange={setImage} required />
    </AdminFormShell>
  );
}
