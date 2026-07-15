"use client";

import { getProject, type ProjectRecord } from "@/lib/admin-api";
import { ProjectForm } from "@/components/admin/project-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditProject({ id }: { id: string }) {
  const { data, error } = useResource<ProjectRecord>(id, getProject, "Could not load project.");
  return (
    <ResourceLoader data={data} error={error}>
      {(project) => <ProjectForm existing={project} />}
    </ResourceLoader>
  );
}
