import Image from "next/image";
import type { Project } from "@/lib/content";
import { formatNumber } from "@/lib/format";

export function ProjectCard({ project }: { project: Project }) {
  const isCompleted = project.status === "completed";
  const stats = [project.type, project.area ? `${formatNumber(project.area)} sqft` : null, project.floors ? `${project.floors} floors` : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="group flex h-full flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-all duration-500 group-hover:scale-[1.04] ${isCompleted ? "" : "grayscale-[20%]"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span
          className={`label absolute left-3 top-3 px-2 py-1 text-[9px] ${
            isCompleted ? "bg-paper/90 text-ink" : "bg-accent text-white"
          }`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>
      <div className="p-3.5 sm:p-5">
        <h3 className="text-sm font-semibold tracking-tight sm:text-base">{project.title}</h3>
        <p className="label mt-1.5 text-[10px]">{project.location} · {project.year}</p>
        {stats && <p className="label mt-1 text-[10px] text-muted">{stats}</p>}
        {project.description && <p className="mt-2 line-clamp-2 text-xs text-graphite">{project.description}</p>}
      </div>
    </div>
  );
}
