import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BedDouble, Bath, Layers, Ruler } from "lucide-react";
import type { Plan } from "@/lib/content";

/** Ready-made plan card with a real photo — opens the plan's detail page. */
export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Link
      href={`/plans/${plan.slug}`}
      className="group flex h-full flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px]">{plan.index}</span>
        {plan.tag && (
          <span className="label absolute right-3 top-3 bg-ink px-2 py-1 text-[9px] text-paper">{plan.tag}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight sm:text-lg">{plan.title}</h3>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="label mt-1 text-[10px]">{plan.config}</p>

        <ul className="mono mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-graphite">
          <li className="flex items-center gap-1.5"><Ruler size={13} /> {plan.area} sqft</li>
          <li className="flex items-center gap-1.5"><Layers size={13} /> {plan.floors} floor{plan.floors > 1 ? "s" : ""}</li>
          <li className="flex items-center gap-1.5"><BedDouble size={13} /> {plan.beds} bed</li>
          <li className="flex items-center gap-1.5"><Bath size={13} /> {plan.baths} bath</li>
        </ul>

        <span className="label mt-auto pt-4 text-[10px] text-ink">View details →</span>
      </div>
    </Link>
  );
}
