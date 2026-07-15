"use client";

import { useState } from "react";
import Image from "next/image";

/** Cover image + scrollable thumbnail strip for a detail page. Used by Plans, Projects and Digital Products. */
export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line">
        <Image src={src} alt={alt} fill unoptimized sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-ink" : "border-line hover:border-line-strong"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill unoptimized sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
