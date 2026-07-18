"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoPanel, emptySeo, type SeoValue } from "@/components/admin/seo-panel";

export default function DevEditorCheck() {
  const [content, setContent] = useState("<p>Hello</p>");
  const [seo, setSeo] = useState<SeoValue>(emptySeo);
  return (
    <div className="space-y-6 p-8">
      <RichTextEditor value={content} onChange={setContent} />
      <SeoPanel value={seo} onChange={setSeo} title="Test" excerpt="Test excerpt" contentHtml={content} />
    </div>
  );
}
