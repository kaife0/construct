import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServiceGrid } from "@/components/services/service-grid";
import { PlansShowcaseSection } from "@/components/services/plans-showcase-section";
import { WhatsAppCtaSection } from "@/components/whatsapp-cta-section";
import { services } from "@/lib/content";

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

      <WhatsAppCtaSection
        heading="Not sure which service you need?"
        message="I'd like help choosing a service."
      />
    </>
  );
}
