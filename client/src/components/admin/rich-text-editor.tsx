"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as ImageExtension } from "@tiptap/extension-image";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Link2, Link2Off, ImagePlus, CornerUpLeft, CornerUpRight, Loader2,
} from "lucide-react";
import { uploadImage, listServices, listPlans, listBlogPosts } from "@/lib/admin-api";

/** Destinations offered by the "Link to a page" picker, on top of the fetched ones. */
const STATIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Calculators", href: "/calculators" },
  { label: "Digital products", href: "/digital-products" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
];

type LinkOption = { label: string; href: string };
type Panel = "link" | "image" | null;

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`grid h-8 w-8 place-items-center transition-colors disabled:opacity-40 ${
        active ? "bg-ink text-paper" : "text-graphite hover:bg-line hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [newTab, setNewTab] = useState(true);
  const [nofollow, setNofollow] = useState(false);
  const [pendingImage, setPendingImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [internalLinks, setInternalLinks] = useState<LinkOption[]>(STATIC_LINKS);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    // Next renders this on the server first; deferring the first paint avoids a hydration mismatch.
    immediatelyRender: false,
    // Keeps the toolbar's active/disabled states in sync with the cursor.
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: false } }),
      ImageExtension.configure({ HTMLAttributes: { class: "w-full" } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose-content min-h-80 px-4 py-3 outline-none" },
    },
  });

  // Pull in every linkable page once, so the picker can offer real destinations by name.
  useEffect(() => {
    Promise.all([listServices(), listPlans(), listBlogPosts()])
      .then(([services, plans, posts]) =>
        setInternalLinks([
          ...STATIC_LINKS,
          ...services.map((s) => ({ label: `Service — ${s.title}`, href: `/services/${s.slug}` })),
          ...plans.map((p) => ({ label: `Plan — ${p.title}`, href: `/plans/${p.slug}` })),
          ...posts.map((p) => ({ label: `Post — ${p.title}`, href: `/blog/${p.slug}` })),
        ])
      )
      .catch(() => {});
  }, []);

  // Reflect edits made outside the editor (e.g. loading an existing post) without clobbering typing.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="min-h-80 border border-line bg-paper" />;

  const openLinkPanel = () => {
    const existing = editor.getAttributes("link");
    setLinkUrl(existing.href ?? "");
    setNewTab(existing.target ? existing.target === "_blank" : true);
    setNofollow(typeof existing.rel === "string" ? existing.rel.includes("nofollow") : false);
    setPanel("link");
  };

  const applyLink = () => {
    const href = linkUrl.trim();
    if (!href) return;
    const rel = ["noopener", "noreferrer", ...(nofollow ? ["nofollow"] : [])].join(" ");
    editor.chain().focus().extendMarkRange("link")
      .setLink({ href, target: newTab ? "_blank" : null, rel })
      .run();
    setPanel(null);
  };

  const insertInternalLink = (href: string) => {
    if (!href) return;
    const option = internalLinks.find((l) => l.href === href);
    const chain = editor.chain().focus().extendMarkRange("link");
    if (editor.state.selection.empty) {
      // Nothing highlighted — drop the page name in as the link text.
      const text = option?.label.replace(/^.*? — /, "") ?? href;
      chain.insertContent(`<a href="${href}">${text}</a>`).run();
    } else {
      chain.setLink({ href }).run();
    }
  };

  const onPickImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setPendingImage(await uploadImage(file, "blog"));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const insertImage = () => {
    editor.chain().focus().setImage({ src: pendingImage, alt: imageAlt.trim() }).run();
    setPendingImage("");
    setImageAlt("");
    setPanel(null);
  };

  return (
    <div className="border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-surface px-2 py-1.5">
        <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={15} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" />

        <ToolbarButton title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Sub-heading" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote size={15} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-line" />

        <ToolbarButton title="Add link" onClick={openLinkPanel} active={editor.isActive("link")}>
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}>
          <Link2Off size={15} />
        </ToolbarButton>
        <ToolbarButton title="Insert image" onClick={() => setPanel(panel === "image" ? null : "image")} active={panel === "image"}>
          <ImagePlus size={15} />
        </ToolbarButton>

        <select
          value=""
          onChange={(e) => insertInternalLink(e.target.value)}
          title="Link to a page on this site"
          className="ml-1 max-w-44 border border-line bg-paper px-2 py-1 text-xs text-ink outline-none"
        >
          <option value="">Link to a page…</option>
          {internalLinks.map((link) => (
            <option key={link.href} value={link.href}>{link.label}</option>
          ))}
        </select>

        <span className="ml-auto flex items-center gap-0.5">
          <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <CornerUpLeft size={15} />
          </ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <CornerUpRight size={15} />
          </ToolbarButton>
        </span>
      </div>

      {panel === "link" && (
        <div className="space-y-2.5 border-b border-line bg-surface px-3 py-3">
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLink())}
            placeholder="https://example.com/article"
            className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-graphite">
              <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} className="h-3.5 w-3.5 accent-ink" />
              Open in new tab
            </label>
            <label className="flex items-center gap-2 text-xs text-graphite">
              <input type="checkbox" checked={nofollow} onChange={(e) => setNofollow(e.target.checked)} className="h-3.5 w-3.5 accent-ink" />
              Nofollow
            </label>
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={() => setPanel(null)} className="px-3 py-1.5 text-xs text-graphite hover:text-ink">
                Cancel
              </button>
              <button type="button" onClick={applyLink} className="bg-ink px-3 py-1.5 text-xs text-paper">
                Add link
              </button>
            </span>
          </div>
        </div>
      )}

      {panel === "image" && (
        <div className="space-y-2.5 border-b border-line bg-surface px-3 py-3">
          {pendingImage ? (
            <>
              <input
                autoFocus
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image for Google, e.g. 30x40 ground floor plan"
                className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setPendingImage(""); setPanel(null); }} className="px-3 py-1.5 text-xs text-graphite hover:text-ink">
                  Cancel
                </button>
                <button type="button" onClick={insertImage} className="bg-ink px-3 py-1.5 text-xs text-paper">
                  Insert image
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 border border-dashed border-line-strong px-3 py-2 text-xs text-graphite transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? "Uploading…" : "Choose an image"}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
