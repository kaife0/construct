import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BedDouble, Bath, Layers, Ruler, Compass } from "lucide-react";
import { getPlans, getPlanBySlug, getSiteSettings } from "@/lib/api";
import { ImageGallery } from "@/components/image-gallery";
import { JsonLd } from "@/components/json-ld";
import type { Plan } from "@/lib/content";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const plans = await getPlans();
  return plans.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) return { title: "Plan" };
  return buildMetadata({
    title: `${plan.title} — ${plan.config} House Plan`,
    description: plan.description,
    path: `/plans/${slug}`,
    images: plan.image ? [plan.image] : undefined,
  });
}

const specs = (plan: Plan) => [
  { icon: Ruler, label: "Built-up area", value: `${plan.area} sqft` },
  { icon: Layers, label: "Floors", value: `${plan.floors}` },
  { icon: BedDouble, label: "Bedrooms", value: `${plan.beds}` },
  { icon: Bath, label: "Bathrooms", value: `${plan.baths}` },
  { icon: Compass, label: "Facing", value: plan.facing },
];

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [plan, { contact }] = await Promise.all([getPlanBySlug(slug), getSiteSettings()]);
  if (!plan) notFound();

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Ready-made Plans", path: "/services#plans" },
          { name: plan.title, path: `/plans/${slug}` },
        ])}
      />
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href="/services#plans" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> Ready-made Plans
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            {plan.config}
            {plan.tag && <span className="text-accent-strong">· {plan.tag}</span>}
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{plan.title}</h1>
        </div>
      </header>

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ImageGallery images={[plan.image, ...(plan.images ?? [])]} alt={plan.title} />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite">{plan.description}</p>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6">
            <span className="label text-[10px]">SPECIFICATIONS</span>
            <ul className="mt-4 divide-y divide-line">
              {specs(plan).map((s) => (
                <li key={s.label} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2.5 text-sm text-graphite">
                    <s.icon size={15} /> {s.label}
                  </span>
                  <span className="mono text-sm font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in the "${plan.title}" plan.`, contact.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
            >
              Discuss this plan on WhatsApp
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-3 text-xs text-graphite">
              Plans can be customised for your plot dimensions, budget and Vastu preferences.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
