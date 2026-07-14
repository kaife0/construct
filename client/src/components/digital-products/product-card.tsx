import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { DigitalProduct } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

export function ProductCard({ product }: { product: DigitalProduct }) {
  return (
    <a
      href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in "${product.title}".`)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px]">{product.index}</span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight sm:text-lg">{product.title}</h3>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-graphite sm:text-sm">{product.description}</p>
        <span className="label mt-auto pt-4 text-[10px] text-ink">
          {product.price ? `₹${product.price.toLocaleString("en-IN")} · Enquire →` : "Enquire →"}
        </span>
      </div>
    </a>
  );
}
