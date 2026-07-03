import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch on WhatsApp, phone or email — response within 24 hours.",
};

const channels = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: "Tap to chat",
    icon: MessageCircle,
    href: whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`),
    external: true,
    accent: true,
  },
  { key: "phone", label: "Phone", value: siteConfig.contact.phone, icon: Phone, href: siteConfig.contact.phoneHref, external: false },
  { key: "email", label: "Email", value: siteConfig.contact.email, icon: Mail, href: `mailto:${siteConfig.contact.email}`, external: false },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="07"
        label="Contact"
        title="Let's build something that lasts."
        lede="Tell us about your project. We usually reply within a day — WhatsApp is fastest."
      />

      <section>
        <div className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
          {/* Channels */}
          <div className="lg:col-span-5">
            <div className="border border-line">
              {channels.map((c, i) => (
                <Reveal key={c.key} delay={i * 0.06}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 border-b border-line p-5 transition-colors last:border-b-0 hover:bg-surface"
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-sm ${c.accent ? "bg-accent text-white" : "bg-accent-soft text-accent-strong"}`}>
                      <c.icon size={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="label text-[10px]">{c.label}</p>
                      <p className="truncate text-base font-medium text-ink">{c.value}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
              <div className="flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-accent-soft text-accent-strong">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="label text-[10px]">Based in</p>
                  <p className="text-base font-medium text-ink">{siteConfig.contact.location}</p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-graphite">
              Working hours: Mon–Sat, 9:00–19:00 IST. For quick questions, WhatsApp gets
              the fastest response.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
