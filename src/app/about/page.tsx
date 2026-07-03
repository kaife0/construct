import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { profile, achievements, process } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The engineer behind CasaStruct — experience, credentials and approach.",
};

const stats = [
  { to: 500, suffix: "+", label: "Projects" },
  { to: 14, suffix: "yrs", label: "Experience" },
  { to: 60, suffix: "+", label: "Cities" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="About"
        title={profile.name}
        lede={profile.role}
      />

      {/* Bio */}
      <section>
        <div className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            {profile.bio.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="mb-5 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">{para}</p>
              </Reveal>
            ))}

            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="display text-3xl sm:text-4xl">
                    <Counter to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="label mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="lg:col-span-5">
            <div className="border border-line bg-surface p-6">
              <span className="label text-[10px]">CREDENTIALS</span>
              <ul className="mt-4 divide-y divide-line">
                {profile.credentials.map((c, i) => (
                  <li key={c} className="flex items-center gap-3 py-3">
                    <span className="label text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-line bg-surface/60">
        <div className="container-x py-16 md:py-20">
          <p className="label">How we work</p>
          <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">A simple, four-step process.</h2>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.06}>
                <div className="h-full bg-surface p-6">
                  <span className="display text-3xl text-accent">{p.step}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements timeline */}
      <section className="border-t border-line">
        <div className="container-x py-16 md:py-20">
          <p className="label">Milestones</p>
          <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">Selected achievements.</h2>
          <div className="mt-12 border-t border-line">
            {achievements.map((a, i) => (
              <Reveal key={a.year} delay={i * 0.05}>
                <div className="grid grid-cols-12 items-baseline gap-4 border-b border-line py-7">
                  <span className="mono col-span-3 text-lg font-semibold text-accent-strong sm:col-span-2">{a.year}</span>
                  <h3 className="col-span-9 text-lg font-semibold tracking-tight sm:col-span-4">{a.title}</h3>
                  <p className="col-span-9 col-start-4 text-sm text-graphite sm:col-span-6 sm:col-start-auto">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <h2 className="display max-w-md text-2xl sm:text-3xl">Let&apos;s talk about your project.</h2>
          <div className="flex gap-3">
            <a
              href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
            >
              WhatsApp
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
