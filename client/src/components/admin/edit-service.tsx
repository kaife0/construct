"use client";

import { getService, type ServiceRecord } from "@/lib/admin-api";
import { ServiceForm } from "@/components/admin/service-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditService({ id }: { id: string }) {
  const { data, error } = useResource<ServiceRecord>(id, getService, "Could not load service.");
  return (
    <ResourceLoader data={data} error={error}>
      {(service) => <ServiceForm existing={service} />}
    </ResourceLoader>
  );
}
