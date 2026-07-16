import type { Metadata } from "next";
import { SpecBar } from "@/components/home/spec-bar";
import { Hero } from "@/components/home/hero";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { CalculatorsSection } from "@/components/home/calculators-section";
import { PlansSection } from "@/components/home/plans-section";
import { StatsSection } from "@/components/home/stats-section";
import { AboutTeaserSection } from "@/components/home/about-teaser-section";
import { JournalSection } from "@/components/home/journal-section";
import { ContactSection } from "@/components/home/contact-section";
import { buildMetadata, allKeywords } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "House Planning, Structural Design & Material Calculators",
  description:
    "Civil engineering & architecture practice — house plans (ghar ka naksha), structural design, interiors, 2D/3D elevations, bar bending schedules and estimation, plus free brick, cement, steel & concrete calculators.",
  path: "/",
  keywords: allKeywords,
});

export default function Home() {
  return (
    <>
      <SpecBar />
      <Hero />
      <CapabilitiesSection />
      <CalculatorsSection />
      <PlansSection />
      <StatsSection />
      <AboutTeaserSection />
      <JournalSection />
      <ContactSection />
    </>
  );
}
