"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getService, type ServiceRecord } from "@/lib/admin-api";
import { ServiceForm } from "@/components/admin/service-form";

export function EditService({ id }: { id: string }) {
  const [service, setService] = useState<ServiceRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getService(id)
      .then(setService)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load service."));
  }, [id]);

  if (error) return <p className="text-sm text-accent-strong">{error}</p>;
  if (!service)
    return (
      <div className="flex items-center gap-2 text-sm text-graphite">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );

  return <ServiceForm existing={service} />;
}
