"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Phone, Mail } from "lucide-react";
import { listInquiries, setInquiryStatus, deleteInquiry, type InquiryRecord, type InquiryStatus } from "@/lib/admin-api";
import { BackLink } from "@/components/admin/back-link";

const statusOptions: InquiryStatus[] = ["new", "contacted", "closed"];

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-accent-soft text-accent-strong",
  contacted: "bg-line text-graphite",
  closed: "bg-ink/5 text-muted",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function InquiriesList() {
  const [inquiries, setInquiries] = useState<InquiryRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    listInquiries()
      .then(setInquiries)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load inquiries."));
  };

  useEffect(load, []);

  const onStatusChange = async (inquiry: InquiryRecord, status: InquiryStatus) => {
    setBusyId(inquiry._id);
    try {
      const updated = await setInquiryStatus(inquiry._id, status);
      setInquiries((prev) => prev?.map((i) => (i._id === updated._id ? updated : i)) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update.");
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (inquiry: InquiryRecord) => {
    if (!confirm(`Delete this inquiry from ${inquiry.name}? This cannot be undone.`)) return;
    setBusyId(inquiry._id);
    try {
      await deleteInquiry(inquiry._id);
      setInquiries((prev) => prev?.filter((i) => i._id !== inquiry._id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <BackLink href="/admin" label="Dashboard" />
      <div className="mt-4">
        <p className="label">Content</p>
        <h1 className="display mt-3 text-3xl">Inquiries</h1>
        <p className="mt-2 text-sm text-graphite">Leads submitted through the contact form and service pages.</p>
      </div>

      {error && <p className="mt-6 text-sm text-accent-strong">{error}</p>}

      {inquiries === null && !error ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {inquiries?.length === 0 && (
            <p className="py-8 text-sm text-graphite">No inquiries yet.</p>
          )}
          {inquiries?.map((inquiry) => (
            <div key={inquiry._id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{inquiry.name}</p>
                  <span className={`label px-2 py-0.5 text-[9px] ${statusStyles[inquiry.status]}`}>{inquiry.status}</span>
                  {inquiry.service && <span className="label text-[10px] text-accent-strong">{inquiry.service}</span>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-graphite">
                  <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1.5 hover:text-ink">
                    <Phone size={13} /> {inquiry.phone}
                  </a>
                  {inquiry.email && (
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1.5 hover:text-ink">
                      <Mail size={13} /> {inquiry.email}
                    </a>
                  )}
                  <span className="label text-[10px]">{fmtDate(inquiry.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{inquiry.message}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <select
                  value={inquiry.status}
                  onChange={(e) => onStatusChange(inquiry, e.target.value as InquiryStatus)}
                  disabled={busyId === inquiry._id}
                  className="border border-line bg-paper px-2.5 py-2 text-sm text-ink outline-none disabled:opacity-50"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onDelete(inquiry)}
                  disabled={busyId === inquiry._id}
                  className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                  aria-label="Delete"
                >
                  {busyId === inquiry._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
