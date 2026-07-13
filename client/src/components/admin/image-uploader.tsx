"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/admin-api";

/** Upload widget: pick a file → uploads immediately → stores the returned URL. */
export function ImageUploader({
  label = "Image",
  value,
  folder,
  onChange,
  required,
}: {
  label?: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}{required && " *"}</label>

      {value ? (
        <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden border border-line">
          <Image src={value} alt="" fill unoptimized sizes="320px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-sm bg-ink/80 text-paper hover:bg-ink"
            aria-label="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] w-full max-w-xs flex-col items-center justify-center gap-2 border border-dashed border-line-strong bg-paper text-graphite transition-colors hover:border-ink hover:text-ink disabled:opacity-60"
        >
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <UploadCloud size={22} />}
          <span className="text-sm">{uploading ? "Uploading…" : "Upload image"}</span>
          <span className="label text-[9px]">JPG / PNG / WebP</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {error && <p className="mt-2 text-xs text-accent-strong">{error}</p>}
    </div>
  );
}
