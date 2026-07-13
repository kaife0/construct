import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PlansGrid } from "@/components/plans-grid";
import { getPlans } from "@/lib/api";

export async function PlansSection() {
  const plans = await getPlans();
  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">(04) — Ready-made plans</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
              Start from a proven plan.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
              Browse ready-made house plans — pick one you like, then tap to discuss
              customising it for your plot on WhatsApp.
            </p>
          </div>
          <Link href="/services#plans" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
            All plans
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10">
          <PlansGrid plans={plans} />
        </div>
      </div>
    </section>
  );
}
