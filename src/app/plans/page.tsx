import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { PlanCard } from "@/components/plan-card";
import { plans } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ready-made Plans",
  description: "Browse ready-made house plans and tap to discuss customising one for your plot.",
};

export default function PlansPage() {
  return (
    <>
      <PageHeader
        index="04"
        label="Ready-made Plans"
        title="Proven plans, ready to customise."
        lede="Pick a plan you like and tap to discuss adapting it to your plot, budget and Vastu on WhatsApp."
      />

      <section>
        <div className="container-x py-12 md:py-16">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>
          <p className="label mt-6 text-[11px]">
            More plans are added regularly · full plan detail pages coming soon
          </p>
        </div>
      </section>
    </>
  );
}
