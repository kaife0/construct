import { BedDouble, Bath, Layers, Ruler } from "lucide-react";
import type { Plan } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

/** Ready-made plan card with a schematic thumbnail and key specs. */
export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="group flex h-full flex-col bg-surface p-6 transition-colors hover:bg-paper">
      <div className="relative aspect-[4/3] border border-line bg-paper">
        <div className="absolute inset-0 blueprint-grid opacity-60" />
        <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full p-3" aria-hidden>
          <rect x="8" y="8" width="104" height="74" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <line x1="60" y1="8" x2="60" y2="82" stroke="var(--line-strong)" strokeWidth="1" />
          <line x1="8" y1="46" x2="60" y2="46" stroke="var(--line-strong)" strokeWidth="1" />
          <rect x="60" y="46" width="52" height="36" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" />
        </svg>
        {plan.tag && (
          <span className="label absolute right-2 top-2 bg-ink px-2 py-1 text-[9px] text-paper">{plan.tag}</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="label text-accent-strong">{plan.index}</span>
        <span className="label text-[10px]">{plan.config}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{plan.title}</h3>

      <ul className="mono mt-3 grid grid-cols-2 gap-y-1.5 text-xs text-graphite">
        <li className="flex items-center gap-1.5"><Ruler size={13} /> {plan.area} sqft</li>
        <li className="flex items-center gap-1.5"><Layers size={13} /> {plan.floors} floor{plan.floors > 1 ? "s" : ""}</li>
        <li className="flex items-center gap-1.5"><BedDouble size={13} /> {plan.beds} bed</li>
        <li className="flex items-center gap-1.5"><Bath size={13} /> {plan.baths} bath</li>
      </ul>

      <a
        href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in the "${plan.title}" plan.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="label mt-auto pt-5 text-ink underline-offset-4 hover:underline"
      >
        Discuss this plan →
      </a>
    </div>
  );
}
