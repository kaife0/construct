import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CalculatorTeaser } from "@/components/calculator-teaser";

export function CalculatorsSection() {
  return (
    <section className="border-t border-line bg-surface/60">
      <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="label">(03) — Smart calculators</p>
          <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
            Estimate materials in seconds.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
            Drag the slider for a quick thumb-rule estimate. The full calculators
            cover bricks, cement, steel, sand and stone — with concrete grades,
            wastage and live ₹ costing you control.
          </p>
          <Link
            href="/calculators"
            className="group mt-8 inline-flex items-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Open all calculators
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <Reveal delay={0.1}>
          <CalculatorTeaser />
        </Reveal>
      </div>
    </section>
  );
}
