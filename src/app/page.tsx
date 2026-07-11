import { SpecBar } from "@/components/home/spec-bar";
import { Hero } from "@/components/home/hero";
import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { CalculatorsSection } from "@/components/home/calculators-section";
import { PlansSection } from "@/components/home/plans-section";
import { StatsSection } from "@/components/home/stats-section";
import { AboutTeaserSection } from "@/components/home/about-teaser-section";
import { JournalSection } from "@/components/home/journal-section";
import { ContactSection } from "@/components/home/contact-section";

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
