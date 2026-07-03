import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ServiceGlyph } from "@/components/service-glyph";
import { services } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "House planning, structural design, interiors, 2D/3D plans, estimation and site supervision.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Services"
        title="Everything from first sketch to final slab."
        lede="Six focused services that cover the full life of a build — engaged individually or end to end."
      />

      <section>
        <div className="container-x py-12 md:py-16">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 0.06}>
                <article
                  id={s.slug}
                  className="group flex h-full flex-col bg-surface p-7 transition-colors hover:bg-paper md:p-9"
                >
                  {/* diagram banner */}
                  <div className="relative mb-7 aspect-[220/150] w-full overflow-hidden border border-line bg-paper">
                    <div className="absolute inset-0 blueprint-grid opacity-50" />
                    <div className="absolute inset-0 p-4">
                      <ServiceGlyph slug={s.slug} />
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="label text-accent-strong">{s.index}</span>
                    <ArrowUpRight
                      size={20}
                      className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink"
                    />
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{s.description}</p>

                  <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-graphite">
                        <Check size={14} className="shrink-0 text-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <a
                      href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in "${s.title}".`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label inline-flex items-center gap-1.5 text-ink underline-offset-4 hover:underline"
                    >
                      Enquire on WhatsApp →
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h2 className="display max-w-md text-2xl sm:text-3xl">
            Not sure which service you need?
          </h2>
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
