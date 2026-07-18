"use client";

import { useState } from "react";
import { Check, X, Plus, Trash2 } from "lucide-react";
import { TextField, TextAreaField, CheckboxField } from "@/components/fields";
import { ImageUploader } from "@/components/admin/image-uploader";
import { SITE_URL } from "@/lib/seo";
import { analyzeSeo, scoreTone } from "@/lib/seo-score";
import type { BlogPostFaq } from "@/lib/admin-api";

export type SeoValue = {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string[];
  canonicalUrl: string;
  noindex: boolean;
  nofollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: BlogPostFaq[];
};

export const emptySeo: SeoValue = {
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  keywords: [],
  canonicalUrl: "",
  noindex: false,
  nofollow: false,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  faqs: [],
};

const TABS = ["General", "Social", "Advanced", "Schema"] as const;
type Tab = (typeof TABS)[number];

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Character counter that turns amber once the snippet is long enough to be truncated by Google. */
function Counter({ length, max }: { length: number; max: number }) {
  return (
    <span className={`text-[11px] tabular-nums ${length > max ? "text-amber-600" : "text-muted"}`}>
      {length}/{max}
    </span>
  );
}

export function SeoPanel({
  value,
  onChange,
  title,
  excerpt,
  contentHtml,
  slug,
}: {
  value: SeoValue;
  onChange: (next: SeoValue) => void;
  title: string;
  excerpt: string;
  contentHtml: string;
  slug?: string;
}) {
  const [tab, setTab] = useState<Tab>("General");
  const set = <K extends keyof SeoValue>(key: K, next: SeoValue[K]) => onChange({ ...value, [key]: next });

  // What actually ships if the SEO fields are left blank — the preview must show the real result.
  const effectiveTitle = value.metaTitle || title;
  const effectiveDescription = value.metaDescription || excerpt;
  const { checks, score, wordCount } = analyzeSeo({
    focusKeyword: value.focusKeyword,
    metaTitle: effectiveTitle,
    metaDescription: effectiveDescription,
    contentHtml,
  });
  const tone = scoreTone(score);
  const previewUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/blog/${slug || slugify(title) || "post-url"}`;

  const updateFaq = (index: number, patch: Partial<BlogPostFaq>) =>
    set("faqs", value.faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)));

  return (
    <div className="border border-line">
      <div className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={`px-3 py-1.5 text-xs transition-colors ${
                tab === name ? "bg-ink text-paper" : "text-graphite hover:text-ink"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <span className={`shrink-0 rounded-sm px-2.5 py-1 text-[11px] font-medium tabular-nums ${tone.className}`}>
          {score}/100 · {tone.label}
        </span>
      </div>

      <div className="space-y-5 p-4">
        {tab === "General" && (
          <>
            <TextField
              label="Focus keyword"
              value={value.focusKeyword}
              onChange={(v) => set("focusKeyword", v)}
              placeholder="e.g. 30x40 house plan"
              hint="The one phrase this post should rank for. Drives the checks below."
            />

            <div>
              <span className="label mb-2 block text-[11px]">Google preview</span>
              <div className="border border-line bg-paper p-4">
                <p className="truncate text-[15px] text-[#1a0dab]">{effectiveTitle || "Your post title"}</p>
                <p className="mt-0.5 truncate text-xs text-[#006621]">{previewUrl}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-graphite">
                  {effectiveDescription || "Your meta description will appear here."}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="label text-[11px]">SEO title</span>
                <Counter length={effectiveTitle.length} max={60} />
              </div>
              <TextField label="" value={value.metaTitle} onChange={(v) => set("metaTitle", v)} placeholder={title} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="label text-[11px]">Meta description</span>
                <Counter length={effectiveDescription.length} max={160} />
              </div>
              <TextAreaField
                label=""
                value={value.metaDescription}
                onChange={(v) => set("metaDescription", v)}
                rows={2}
                placeholder={excerpt}
              />
            </div>

            <div>
              <p className="label mb-2 text-[11px]">Checks · {wordCount} words</p>
              <ul className="space-y-1.5">
                {checks.map((check) => (
                  <li key={check.label} className="flex items-start gap-2 text-xs">
                    {check.passed ? (
                      <Check size={14} className="mt-px shrink-0 text-emerald-600" />
                    ) : (
                      <X size={14} className="mt-px shrink-0 text-red-600" />
                    )}
                    <span className={check.passed ? "text-graphite" : "text-ink"}>{check.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {tab === "Social" && (
          <>
            <p className="text-xs text-muted">
              Used when the post is shared on WhatsApp, Facebook or LinkedIn. Leave blank to reuse the SEO title,
              description and cover image.
            </p>
            <TextField label="Social title" value={value.ogTitle} onChange={(v) => set("ogTitle", v)} placeholder={effectiveTitle} />
            <TextAreaField
              label="Social description"
              value={value.ogDescription}
              onChange={(v) => set("ogDescription", v)}
              rows={2}
              placeholder={effectiveDescription}
            />
            <ImageUploader label="Social image" value={value.ogImage} folder="blog" onChange={(v) => set("ogImage", v)} />
          </>
        )}

        {tab === "Advanced" && (
          <>
            <TextField
              label="Canonical URL"
              value={value.canonicalUrl}
              onChange={(v) => set("canonicalUrl", v)}
              placeholder={`${SITE_URL}/blog/${slug || slugify(title)}`}
              hint="Only set this if the same article is published elsewhere and that copy should rank instead."
            />
            <TextField
              label="Additional keywords"
              value={value.keywords.join(", ")}
              onChange={(v) => set("keywords", v.split(",").map((k) => k.trim()).filter(Boolean))}
              placeholder="house plan, naksha, vastu"
              hint="Comma separated."
            />
            <CheckboxField
              label="No index"
              checked={value.noindex}
              onChange={(v) => set("noindex", v)}
              hint="Hides this post from Google. Leave off unless you have a reason."
            />
            <CheckboxField
              label="No follow"
              checked={value.nofollow}
              onChange={(v) => set("nofollow", v)}
              hint="Tells search engines not to pass ranking credit to links in this post."
            />
          </>
        )}

        {tab === "Schema" && (
          <>
            <p className="text-xs text-muted">
              Add common questions to qualify for Google&apos;s expandable FAQ result. They are also shown at the
              bottom of the post.
            </p>
            {value.faqs.map((faq, index) => (
              <div key={index} className="space-y-3 border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="label text-[11px]">Question {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => set("faqs", value.faqs.filter((_, i) => i !== index))}
                    className="text-graphite transition-colors hover:text-red-600"
                    aria-label="Remove question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <TextField label="" value={faq.question} onChange={(v) => updateFaq(index, { question: v })} placeholder="How much does a 30x40 house cost?" />
                <TextAreaField label="" value={faq.answer} onChange={(v) => updateFaq(index, { answer: v })} rows={2} placeholder="Answer in one or two sentences." />
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("faqs", [...value.faqs, { question: "", answer: "" }])}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs text-ink transition-colors hover:border-ink"
            >
              <Plus size={14} /> Add question
            </button>
          </>
        )}
      </div>
    </div>
  );
}
