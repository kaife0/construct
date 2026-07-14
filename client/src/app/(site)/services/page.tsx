import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ServiceGrid } from "@/components/services/service-grid";
import { WhatsAppCtaSection } from "@/components/whatsapp-cta-section";
import { getServices } from "@/lib/api";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Floor plans, interior design, exterior elevation, 3D walkthroughs, BBS, estimation, approvals, renovation and drafting support.",
};

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
