import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TechnicalDrawing } from "@/components/technical-drawing";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getSiteSettings } from "@/lib/api";

export async function Hero() {
  const { contact } = await getSiteSettings();
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-accent" />
              (01) — Civil Engineering &amp; Architecture
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="display mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.6rem]">
              We design, plan
              <br />
              and build to
              <br />
              <span className="text-accent">last.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-graphite sm:text-lg">
              From the first sketch to the final slab — house planning, structural
              design, interiors and precise 2D/3D drawings. Backed by smart material
              calculators and ready-made plans you can start from today.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`, contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
              >
                Start your project
                <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                href="/calculators"
                className="group inline-flex items-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                Try the calculators
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="lg:col-span-5">
          <div className="relative">
            <span className="absolute -left-1.5 -top-1.5 h-4 w-4 border-l border-t border-ink/40" />
            <span className="absolute -right-1.5 -top-1.5 h-4 w-4 border-r border-t border-ink/40" />
            <span className="absolute -bottom-1.5 -left-1.5 h-4 w-4 border-b border-l border-ink/40" />
            <span className="absolute -bottom-1.5 -right-1.5 h-4 w-4 border-b border-r border-ink/40" />
            <div className="border border-line bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="label text-[10px]">DWG-01 / ELEVATION</span>
                <span className="label text-[10px]">SCALE 1:100</span>
              </div>
              <TechnicalDrawing />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
