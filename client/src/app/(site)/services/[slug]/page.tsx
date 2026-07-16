import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getServices, getServiceBySlug, getSiteSettings } from "@/lib/api";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
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
  const [service, { contact }] = await Promise.all([getServiceBySlug(slug), getSiteSettings()]);
  if (!service) notFound();

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
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href="/services" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> Services
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            Service {service.index}
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">{service.summary}</p>
        </div>
      </header>

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] w-full overflow-hidden border border-line">
            <Image
              src={service.image}
              alt={service.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite">{service.description}</p>

          {service.deliverables.length > 0 && (
            <div className="mt-10">
              <span className="label text-[10px]">WHAT&apos;S INCLUDED</span>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-graphite">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in "${service.title}".`, contact.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
          >
            Enquire on WhatsApp
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="lg:col-span-5">
          <InquiryForm fixedService={service.title} whatsappNumber={contact.whatsappNumber} />
        </div>
      </div>
    </article>
  );
}
