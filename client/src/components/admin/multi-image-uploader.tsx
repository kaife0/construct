"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/admin-api";

/** Upload widget for a gallery of extra images shown on a detail page (the cover image uses ImageUploader instead). */
export function MultiImageUploader({
  label = "Additional images",
  value,
  folder,
  onChange,
}: {
  label?: string;
  value: string[];
  folder: string;
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file, folder)));
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}</label>

      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative h-24 w-24 shrink-0 overflow-hidden border border-line">
            <Image src={url} alt="" fill unoptimized sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-sm bg-ink/80 text-paper hover:bg-ink"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1.5 border border-dashed border-line-strong bg-paper text-graphite transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
          <span className="text-xs">{uploading ? "Uploading…" : "Add"}</span>
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
      {error && <p className="mt-2 text-xs text-accent-strong">{error}</p>}
    </div>
  );
}
