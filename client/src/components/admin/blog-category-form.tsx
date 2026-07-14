"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/fields";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { createBlogCategory, updateBlogCategory, type BlogCategoryRecord } from "@/lib/admin-api";

export function BlogCategoryForm({ existing }: { existing?: BlogCategoryRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    try {
      if (editing && existing) {
        await updateBlogCategory(existing._id, { title: title.trim() });
      } else {
        await createBlogCategory({ title: title.trim() });
      }
      router.push("/admin/blog-categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref="/admin/blog-categories"
      backLabel="Blog Categories"
      heading={editing ? "Edit category" : "New category"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create category"}
      cancelHref="/admin/blog-categories"
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. Estimation" required />
    </AdminFormShell>
  );
}
