"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, NumberField, SelectField, CheckboxField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import {
  createBlogPost,
  updateBlogPost,
  listBlogCategories,
  type BlogPostRecord,
  type BlogCategoryRecord,
} from "@/lib/admin-api";

export function BlogPostForm({ existing }: { existing?: BlogPostRecord }) {
  const router = useRouter();
  const editing = Boolean(existing);

  const [categories, setCategories] = useState<BlogCategoryRecord[]>([]);
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [readMins, setReadMins] = useState(existing?.readMins ?? 4);
  const [published, setPublished] = useState(existing?.published ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listBlogCategories().then((list) => {
      setCategories(list);
      setCategoryId((current) => current || list[0]?._id || "");
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !excerpt.trim() || !categoryId) {
      setError("Title, excerpt and category are required.");
      return;
    }
    if (!image) {
      setError("Please upload a cover image.");
      return;
    }

    const payload = {
      categoryId,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image,
      readMins,
      published,
    };

    setSaving(true);
    try {
      if (editing && existing) {
        await updateBlogPost(existing._id, payload);
      } else {
        await createBlogPost(payload);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setSaving(false);
    }
  };

  return (
    <AdminFormShell
      backHref="/admin/blog"
      backLabel="Blog"
      heading={editing ? "Edit post" : "New post"}
      onSubmit={onSubmit}
      error={error}
      saving={saving}
      submitLabel={saving ? "Saving…" : editing ? "Save changes" : "Create post"}
      cancelHref="/admin/blog"
    >
      <TextField label="Title" value={title} onChange={setTitle} placeholder="e.g. How many bricks does your wall need?" required />
      <TextAreaField label="Excerpt" value={excerpt} onChange={setExcerpt} rows={2} required />
      <ImageUploader label="Cover image" value={image} folder="blog" onChange={setImage} required />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          options={categories.map((c) => ({ value: c._id, label: c.title }))}
          required
        />
        <NumberField label="Read time" suffix="min" value={readMins} onChange={setReadMins} min={1} required />
      </div>

      <TextAreaField
        label="Content"
        value={content}
        onChange={setContent}
        rows={14}
        hint="Markdown supported — paste your draft in. Use ## for headings, **bold**, and blank lines between paragraphs."
        placeholder="Write or paste the article here…"
      />

      <CheckboxField label="Published" checked={published} onChange={setPublished} hint="Unpublished posts are only visible in the admin panel." />
    </AdminFormShell>
  );
}
