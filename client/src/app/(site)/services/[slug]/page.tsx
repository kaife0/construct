import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getServices, getServiceBySlug, getSiteSettings } from "@/lib/api";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { ServiceGrid } from "@/components/services/service-grid";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return buildMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${slug}`,
    images: service.image ? [service.image] : undefined,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // One services fetch covers both the current service and the "other services" strip.
  const [services, { contact }] = await Promise.all([getServices(), getSiteSettings()]);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);
  const enquiryUrl = whatsappUrl(
    `Hi ${siteConfig.name}, I'm interested in "${service.title}".`,
    contact.whatsappNumber
  );

  return (
    <article>
      <JsonLd
        data={[
          serviceJsonLd({
            name: service.title,
            description: service.summary,
            path: `/services/${slug}`,
            image: service.image,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${slug}` },
          ]),
        ]}
      />
      {/* Split hero — the title sits beside the image rather than alone in a full-width band,
          which is what made the old header read as oversized with dead space around it. */}
      <header className="border-b border-line">
        <div className="container-x py-10 md:py-14">
          <Reveal>
            <nav aria-label="Breadcrumb" className="label flex items-center gap-2">
              <Link href="/services" className="text-graphite transition-colors hover:text-ink">
                Services
              </Link>
              <span className="text-muted">/</span>
              <span className="text-ink">{service.title}</span>
            </nav>
          </Reveal>

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-6">
              <Reveal delay={0.05}>
                <p className="label flex items-center gap-3">
                  <span className="inline-block h-px w-8 bg-accent" />
                  Service {service.index}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1 className="display mt-4 text-2xl sm:text-4xl">{service.title}</h1>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-graphite">{service.summary}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <a
                  href={enquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
                >
                  Enquire on WhatsApp
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="lg:col-span-6">
              <div className="group relative aspect-16/10 w-full overflow-hidden border border-line">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="max-w-xl text-base leading-relaxed text-graphite">{service.description}</p>
          </Reveal>

          {service.deliverables.length > 0 && (
            <div className="mt-10">
              <Reveal>
                <span className="label text-[10px]">WHAT&apos;S INCLUDED</span>
              </Reveal>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                {service.deliverables.map((deliverable, i) => (
                  <li key={deliverable} className="h-full">
                    <Reveal delay={(i % 2) * 0.05} className="h-full">
                      <div className="flex h-full items-start gap-2 border border-line bg-surface p-3 text-xs leading-relaxed text-graphite transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm sm:gap-2.5 sm:p-4 sm:text-sm">
                        <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                        {deliverable}
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sticky on desktop so the enquiry form stays reachable while the content scrolls. */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <InquiryForm fixedService={service.title} whatsappNumber={contact.whatsappNumber} />
          </div>
        </div>
      </div>

      {otherServices.length > 0 && (
        <section className="border-t border-line">
          <div className="container-x py-10 md:py-14">
            <Reveal>
              <h2 className="label flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-accent" />
                Other services
              </h2>
            </Reveal>
            <div className="mt-6">
              <ServiceGrid services={otherServices} />
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
