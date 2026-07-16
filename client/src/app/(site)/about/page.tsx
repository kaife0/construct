import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BioSection } from "@/components/about/bio-section";
import { ProcessSection } from "@/components/about/process-section";
import { WorkShowcaseSection } from "@/components/about/work-showcase-section";
import { AchievementsSection } from "@/components/about/achievements-section";
import { WhatsAppCtaSection } from "@/components/whatsapp-cta-section";
import { getProjects, getSiteSettings } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteSettings();
  return buildMetadata({
    title: `About ${profile.name} — ${profile.role}`,
    description: profile.intro,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [projects, { profile }] = await Promise.all([getProjects(), getSiteSettings()]);
  return (
    <>
      <PageHeader index="05" label="About" title={profile.name} lede={profile.role} />
      <BioSection />
      <ProcessSection />
      <WorkShowcaseSection projects={projects} />
      <AchievementsSection />
      <WhatsAppCtaSection
        heading="Let's talk about your project."
        message="I'd like to discuss a project."
        buttonLabel="WhatsApp"
      />
    </>
  );
}
