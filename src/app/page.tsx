import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { TechnicalDrawing } from "@/components/technical-drawing";
import { CalculatorTeaser } from "@/components/calculator-teaser";
import { PlanCard } from "@/components/plan-card";
import { ServiceGlyph } from "@/components/service-glyph";
import { services, plans, posts, profile } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";

const stats = [
  { to: 500, suffix: "+", label: "Projects delivered" },
  { to: 14, suffix: "yrs", label: "Field experience" },
  { to: 60, suffix: "+", label: "Cities served" },
  { to: 98, suffix: "%", label: "On-time handover" },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function Home() {
  return (
    <>
      {/* ── Spec bar ───────────────────────────────────────── */}
      <div className="border-b border-line">
        <div className="container-x flex items-center justify-between gap-4 overflow-x-auto py-2.5">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <span className="label">EST. 2010</span>
            <span className="label hidden sm:inline">RCC · Steel · Interiors</span>
            <span className="label hidden md:inline">Residential · Commercial</span>
          </div>
          <span className="label whitespace-nowrap text-accent-strong">● Available for new projects</span>
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
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
                  href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`)}
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

      {/* ── (02) Capabilities ──────────────────────────────── */}
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

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link
                  href={`/services#${c.slug}`}
                  className="group flex h-full flex-col bg-surface p-6 transition-colors hover:bg-paper"
                >
                  <div className="relative mb-6 aspect-[220/150] w-full overflow-hidden border border-line bg-paper">
                    <div className="absolute inset-0 blueprint-grid opacity-50" />
                    <div className="absolute inset-0 p-3.5">
                      <ServiceGlyph slug={c.slug} />
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="label text-accent-strong">{c.index}</span>
                    <ArrowUpRight size={18} className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{c.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── (03) Calculators ───────────────────────────────── */}
      <section className="border-t border-line bg-surface/60">
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="label">(03) — Smart calculators</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
              Estimate materials in seconds.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
              Drag the slider for a quick thumb-rule estimate of bricks, cement and steel.
              The full calculators cover concrete grades, wall thickness, wastage and live
              ₹ costing — with rates you control.
            </p>
            <Link
              href="/calculators"
              className="group mt-8 inline-flex items-center gap-2 rounded-sm border border-line-strong px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Open all calculators
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <Reveal delay={0.1}>
            <CalculatorTeaser />
          </Reveal>
        </div>
      </section>

      {/* ── (04) Ready-made plans ──────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-x py-16 md:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="label">(04) — Ready-made plans</p>
              <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
                Start from a proven plan.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-graphite">
                Browse ready-made house plans — pick one you like, then tap to discuss
                customising it for your plot on WhatsApp.
              </p>
            </div>
            <Link href="/plans" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
              All plans
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <PlanCard plan={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────── */}
      <section className="border-t border-line bg-ink text-paper">
        <div className="container-x grid grid-cols-2 gap-8 py-16 md:grid-cols-4 md:py-20">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <p className="display text-4xl text-paper sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="label mt-3 text-paper/50">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── (05) About teaser ──────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label">(05) — The engineer</p>
            <h2 className="display mt-4 max-w-lg text-3xl sm:text-4xl">
              Engineering that&apos;s meant to be invisible — it just works.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-graphite">{profile.intro}</p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent-strong"
            >
              About {profile.name}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-line bg-surface p-6">
              <span className="label text-[10px]">PROFILE</span>
              <p className="mt-3 text-xl font-semibold tracking-tight">{profile.name}</p>
              <p className="text-sm text-graphite">{profile.role}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {profile.credentials.map((c) => (
                  <li key={c} className="label border border-line px-2.5 py-1 text-[10px] text-graphite">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── (06) Journal ───────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-x py-16 md:py-24">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="label">(06) — Journal</p>
              <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">Notes from the field.</h2>
            </div>
            <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
              Read the blog
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-12 border-t border-line">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-12 items-center gap-4 border-b border-line py-7 transition-colors hover:bg-surface"
                >
                  <span className="label col-span-4 sm:col-span-2">{post.category}</span>
                  <h3 className="col-span-12 text-lg font-semibold tracking-tight sm:col-span-6 sm:text-xl">{post.title}</h3>
                  <span className="label col-span-8 sm:col-span-3">{fmtDate(post.date)} · {post.readMins} min</span>
                  <span className="col-span-4 hidden justify-self-end text-graphite transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink sm:col-span-1 sm:flex">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
