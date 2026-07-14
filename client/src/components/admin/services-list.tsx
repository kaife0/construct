"use client";

import { listServices, deleteService, type ServiceRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function ServicesList() {
  return (
    <AdminResourceList<ServiceRecord>
      title="Services"
      newHref="/admin/services/new"
      newLabel="New service"
      emptyLabel="No services yet. Create your first one."
      list={listServices}
      remove={deleteService}
      editHref={(s) => `/admin/services/${s._id}/edit`}
      getId={(s) => s._id}
      getImage={(s) => s.image}
      getTitle={(s) => s.title}
      renderSubtitle={(s) => s.summary}
    />
  );
}
