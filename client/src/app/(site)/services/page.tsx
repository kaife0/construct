import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServiceGrid } from "@/components/services/service-grid";
import { WhatsAppCtaSection } from "@/components/whatsapp-cta-section";
import { getServices } from "@/lib/api";
import { buildMetadata, keywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "House planning, structural design, interior design, exterior & 3D elevation, walkthroughs, bar bending schedule (BBS), estimation & BOQ, approval drawings, renovation and CAD drafting support.",
  path: "/services",
  keywords: [...keywords.services, ...keywords.planning],
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        index="01"
        label="Services"
        title="Everything from first sketch to final slab."
        lede="Nine ways to work with us — engaged individually or end to end. Tap any service to see exactly what's included."
      />

      <section>
        <div className="container-x py-10 md:py-14">
          <ServiceGrid services={services} />
        </div>
      </section>

      <WhatsAppCtaSection
        heading="Not sure which service you need?"
        message="I'd like help choosing a service."
      />
    </>
  );
}
