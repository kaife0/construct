"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/about/project-card";
import type { Project } from "@/lib/content";

const filters = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "in-progress", label: "In Progress" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function WorkShowcaseSection({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<FilterKey>("all");

  const visible = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.status === active)),
    [active, projects]
  );

  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-20">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">Our work</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">
              Completed builds &amp; work in progress.
            </h2>
          </div>

          {/* filter tabs */}
          <div className="flex border border-line">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className="relative px-4 py-2.5 text-sm font-medium text-graphite transition-colors data-[active=true]:text-ink"
                data-active={active === f.key}
              >
                <span className="relative z-10">{f.label}</span>
                {active === f.key && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 bg-accent-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {visible.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
