"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { TextField, TextAreaField } from "@/components/admin/form-fields";
import { ImageUploader } from "@/components/admin/image-uploader";
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
    <div>
      <Link href="/admin/services" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
        <ArrowLeft size={14} /> Services
      </Link>
      <h1 className="display mt-4 text-3xl">{editing ? "Edit service" : "New service"}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid max-w-2xl gap-6">
        <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. House Planning" required />
        <TextField label="Summary" value={summary} onChange={setSummary} placeholder="One-line summary shown on cards" required />
        <TextAreaField label="Description" value={description} onChange={setDescription} rows={5} required />
        <TextAreaField
          label="Deliverables"
          value={deliverables}
          onChange={setDeliverables}
          rows={5}
          hint="One per line."
          placeholder={"Site & plot analysis\nZoning & floor layouts"}
        />
        <ImageUploader label="Image" value={image} folder="services" onChange={setImage} required />

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
            {saving ? "Saving…" : editing ? "Save changes" : "Create service"}
          </button>
          <Link href="/admin/services" className="text-sm font-medium text-graphite hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
