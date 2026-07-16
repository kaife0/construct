"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, NumberField, SelectField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { createProject, updateProject, type ProjectRecord } from "@/lib/admin-api";

export function ProjectForm({ existing }: { existing?: ProjectRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [status, setStatus] = useState<"completed" | "in-progress">(existing?.status ?? "completed");
  const [year, setYear] = useState(existing?.year ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [area, setArea] = useState(existing?.area ?? 0);
  const [floors, setFloors] = useState(existing?.floors ?? 0);
  const [type, setType] = useState(existing?.type ?? "");
  const [budget, setBudget] = useState(existing?.budget ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !location.trim() || !year.trim()) {
      setError("Title, location and year are required.");
      return;
    }
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    const payload = {
      title: title.trim(),
      location: location.trim(),
      status,
      year: year.trim(),
      image,
      images,
      description: description.trim() || undefined,
      area: area || undefined,
      floors: floors || undefined,
      type: type.trim() || undefined,
      budget: budget || undefined,
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updateProject(existing._id, payload);
      } else {
        await createProject(payload);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref="/admin/projects"
      backLabel="Our Work"
      heading={editing ? "Edit project" : "New project"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create project"}
      cancelHref="/admin/projects"
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Riverside Residence" required />
      <TextField label="Location" value={location} onChange={setLocation} placeholder="e.g. Pune, MH" required />
      <SelectField
        label="Status"
        value={status}
        onChange={setStatus}
        options={[
          { value: "completed", label: "Completed" },
          { value: "in-progress", label: "In Progress" },
        ]}
        required
      />
      <TextField label="Year" value={year} onChange={setYear} placeholder="e.g. 2026" required />
      <TextField label="Type" value={type} onChange={setType} placeholder="e.g. Residential, Commercial, Renovation" />
      <TextAreaField
        label="Description"
        value={description}
        onChange={setDescription}
        rows={4}
        hint="Optional — a short write-up shown for the project."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberField label="Area" suffix="sqft" value={area} onChange={setArea} />
        <NumberField label="Floors" value={floors} onChange={setFloors} />
        <NumberField label="Budget" suffix="₹" value={budget} onChange={setBudget} step={10000} />
      </div>
      <ImageUploader label="Image" value={image} folder="projects" onChange={setImage} required />
      <MultiImageUploader value={images} folder="projects" onChange={setImages} />
    </AdminFormShell>
  );
}
