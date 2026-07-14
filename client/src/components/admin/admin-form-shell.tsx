import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { BackLink } from "@/components/admin/back-link";
import type { ReactNode } from "react";

/** Shared chrome for every admin create/edit form — back link, heading, field slot, error box, submit/cancel. */
export function AdminFormShell({
  backHref,
  backLabel,
  heading,
  onSubmit,
  error,
  saving,
  submitLabel,
  cancelHref,
  children,
}: {
  backHref: string;
  backLabel: string;
  heading: string;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  saving: boolean;
  submitLabel: string;
  cancelHref: string;
  children: ReactNode;
}) {
  return (
    <div>
      <BackLink href={backHref} label={backLabel} />
      <h1 className="display mt-4 text-3xl">{heading}</h1>

      <form onSubmit={onSubmit} className="mt-8 grid max-w-2xl gap-6">
        {children}

        {error && (
          <div className="flex items-start gap-2 border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-strong">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity disabled:opacity-50"
          >
            {submitLabel}
          </button>
          <Link href={cancelHref} className="text-sm font-medium text-graphite hover:text-ink">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
