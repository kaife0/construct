import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CalculatorsApp } from "@/components/calculators/calculators-app";
import { WhatsAppCtaSection } from "@/components/whatsapp-cta-section";
import { getCalculatorRates } from "@/lib/api";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Estimate bricks, cement, steel, sand and stone for your build — with live ₹ costing.",
};

export default async function CalculatorsPage() {
  const rates = await getCalculatorRates();
  return (
    <>
      <PageHeader
        index="03"
        label="Smart Calculators"
        title="Estimate materials in seconds."
        lede="Bricks, cement, steel, sand and stone — with concrete grades, wastage and live ₹ costing built in."
      />

      <section>
        <div className="container-x py-10 md:py-14">
          <CalculatorsApp rates={rates} />
        </div>
      </section>

      <WhatsAppCtaSection
        heading="Need a precise, signed-off BOQ?"
        message="I'd like a detailed quantity estimate for my project."
      />
    </>
  );
}
