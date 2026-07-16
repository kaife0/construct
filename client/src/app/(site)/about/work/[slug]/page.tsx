import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, CalendarDays, Ruler, Layers } from "lucide-react";
import { getProjects, getProjectBySlug, getSiteSettings } from "@/lib/api";
import type { Project } from "@/lib/content";
import { ImageGallery } from "@/components/image-gallery";
import { JsonLd } from "@/components/json-ld";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return buildMetadata({
    title: `${project.title} — ${project.location}`,
    description:
      project.description ?? `${project.title} — a ${project.type ?? "construction"} project in ${project.location} (${project.year}).`,
    path: `/about/work/${slug}`,
    images: project.image ? [project.image] : undefined,
  });
}

const specs = (project: Project) =>
  [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: CalendarDays, label: "Year", value: project.year },
    project.area ? { icon: Ruler, label: "Built-up area", value: `${project.area} sqft` } : null,
    project.floors ? { icon: Layers, label: "Floors", value: `${project.floors}` } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, { contact }] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) notFound();

  const isCompleted = project.status === "completed";

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: project.title, path: `/about/work/${slug}` },
        ])}
      />
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href="/about" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> Our Work
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            {project.type ?? (isCompleted ? "Completed" : "In Progress")}
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{project.title}</h1>
        </div>
      </header>

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ImageGallery images={[project.image, ...(project.images ?? [])]} alt={project.title} />
          {project.description && <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite">{project.description}</p>}
        </div>

        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6">
            <span className="label text-[10px]">DETAILS</span>
            <ul className="mt-4 divide-y divide-line">
              {specs(project).map((s) => (
                <li key={s.label} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2.5 text-sm text-graphite">
                    <s.icon size={15} /> {s.label}
                  </span>
                  <span className="mono text-sm font-semibold">{s.value}</span>
                </li>
              ))}
            </ul>

            <a
              href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to know more about the "${project.title}" project.`, contact.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
            >
              Discuss a similar project
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
