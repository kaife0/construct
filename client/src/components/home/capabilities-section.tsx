import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ServiceGlyph } from "@/components/service-glyph";
import { getServices } from "@/lib/api";

export async function CapabilitiesSection() {
  const services = await getServices();
  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">(02) — What we do</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
              Full-scope engineering, one accountable team.
            </h2>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
            All services
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {services.slice(0, 4).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={`/services#${c.slug}`}
                className="group flex h-full flex-col border border-line bg-surface p-4 transition-shadow duration-300 hover:shadow-sm sm:p-6"
              >
                <div className="relative mb-4 aspect-[220/150] w-full overflow-hidden border border-line bg-paper sm:mb-6">
                  <div className="absolute inset-0 blueprint-grid opacity-50" />
                  <div className="absolute inset-0 p-2.5 sm:p-3.5">
                    <ServiceGlyph slug={c.slug} />
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <span className="label text-accent-strong">{c.index}</span>
                  <ArrowUpRight size={16} className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink" />
                </div>
                <h3 className="mt-2.5 text-base font-semibold tracking-tight sm:text-lg">{c.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-graphite sm:text-sm">{c.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
