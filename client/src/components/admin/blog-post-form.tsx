"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextAreaField, NumberField, SelectField, CheckboxField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoPanel, emptySeo, type SeoValue } from "@/components/admin/seo-panel";
import {
  createBlogPost,
  updateBlogPost,
  listBlogCategories,
  type BlogPostRecord,
  type BlogCategoryRecord,
} from "@/lib/admin-api";

const pickSeo = (post?: BlogPostRecord): SeoValue =>
  post
    ? {
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
        focusKeyword: post.focusKeyword ?? "",
        keywords: post.keywords ?? [],
        canonicalUrl: post.canonicalUrl ?? "",
        noindex: post.noindex ?? false,
        nofollow: post.nofollow ?? false,
        ogTitle: post.ogTitle ?? "",
        ogDescription: post.ogDescription ?? "",
        ogImage: post.ogImage ?? "",
        faqs: post.faqs ?? [],
      }
    : emptySeo;

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
  const [seo, setSeo] = useState<SeoValue>(() => pickSeo(existing));
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
      ...seo,
      faqs: seo.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
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

      <div>
        <label className="label mb-2 block text-[11px]">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <SeoPanel value={seo} onChange={setSeo} title={title} excerpt={excerpt} contentHtml={content} slug={existing?.slug} />

      <CheckboxField label="Published" checked={published} onChange={setPublished} hint="Unpublished posts are only visible in the admin panel." />
    </AdminFormShell>
  );
}
