import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ServiceGrid } from "@/components/services/service-grid";
import { PlansShowcaseSection } from "@/components/services/plans-showcase-section";
import { services } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "House planning, structural design, interiors, 2D/3D plans, estimation, site supervision and ready-made plans.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Services"
        title="Everything from first sketch to final slab."
        lede="Seven ways to work with us — engaged individually or end to end."
      />

      <section>
        <div className="container-x py-10 md:py-14">
          <ServiceGrid services={services} />
        </div>
      </section>

      <PlansShowcaseSection />

      {/* CTA */}
      <section className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
          <h2 className="display max-w-md text-2xl sm:text-3xl">Not sure which service you need?</h2>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd like help choosing a service.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
          >
            Ask on WhatsApp
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </section>
    </>
  );
}
