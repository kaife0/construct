import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <a
      id={service.slug}
      href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in "${service.title}".`)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full scroll-mt-20 flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-sm"
    >
      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px]">{service.index}</span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight sm:text-lg">{service.title}</h2>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-graphite sm:mt-2 sm:text-sm">
          {service.summary}
        </p>

        {/* deliverables — desktop only, keeps mobile compact */}
        <ul className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
          {service.deliverables.slice(0, 3).map((d) => (
            <li key={d} className="label border border-line px-2 py-0.5 text-[9px] text-graphite">{d}</li>
          ))}
        </ul>

        <span className="label mt-auto pt-4 text-ink">Enquire →</span>
      </div>
    </a>
  );
}
