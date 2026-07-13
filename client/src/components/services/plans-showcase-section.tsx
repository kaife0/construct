import { PlansGrid } from "@/components/plans-grid";
import { getPlans } from "@/lib/api";

/** Ready-made plans as a service on its own — same grid used on Home. */
export async function PlansShowcaseSection() {
  const plans = await getPlans();
  return (
    <section id="plans" className="scroll-mt-20 border-t border-line">
      <div className="container-x py-12 md:py-16">
        <p className="label">Also available</p>
        <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
          Or start from a proven plan.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-graphite sm:text-base">
          Pick a ready-made plan and tap to discuss customising it for your plot,
          budget and Vastu — on WhatsApp.
        </p>
        <div className="mt-10">
          <PlansGrid plans={plans} lgCols={3} />
        </div>
      </div>
    </section>
  );
}
