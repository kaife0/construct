"use client";

import { listProjects, deleteProject, type ProjectRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function ProjectsList() {
  return (
    <AdminResourceList<ProjectRecord>
      title="Our Work"
      newHref="/admin/projects/new"
      newLabel="New project"
      emptyLabel="No projects yet. Create your first one."
      list={listProjects}
      remove={deleteProject}
      editHref={(p) => `/admin/projects/${p._id}/edit`}
      getId={(p) => p._id}
      getImage={(p) => p.image}
      getTitle={(p) => p.title}
      renderSubtitle={(p) => `${p.location} · ${p.year} · ${p.status === "completed" ? "Completed" : "In Progress"}`}
    />
  );
}
