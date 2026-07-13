"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { listServices, deleteService, type ServiceRecord } from "@/lib/admin-api";

export function ServicesList() {
  const [services, setServices] = useState<ServiceRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listServices()
      .then(setServices)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load services."));
  };

  useEffect(load, []);

  const onDelete = async (svc: ServiceRecord) => {
    if (!confirm(`Delete "${svc.title}"? This cannot be undone.`)) return;
    setDeletingId(svc._id);
    try {
      await deleteService(svc._id);
      setServices((prev) => prev?.filter((s) => s._id !== svc._id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="label">Content</p>
          <h1 className="display mt-3 text-3xl">Services</h1>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper"
        >
          <Plus size={16} /> New service
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-accent-strong">{error}</p>}

      {services === null && !error ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {services?.length === 0 && (
            <p className="py-8 text-sm text-graphite">No services yet. Create your first one.</p>
          )}
          {services?.map((svc) => (
            <div key={svc._id} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                {svc.image && (
                  <Image src={svc.image} alt="" fill unoptimized sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{svc.title}</p>
                <p className="truncate text-sm text-graphite">{svc.summary}</p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/services/${svc._id}/edit`}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-ink hover:text-ink"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(svc)}
                  disabled={deletingId === svc._id}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deletingId === svc._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
