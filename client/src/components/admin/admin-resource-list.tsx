"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { BackLink } from "@/components/admin/back-link";

/**
 * Shared list/delete UI for every admin resource (Services, Plans, Digital
 * Products, …) — a thumbnail row with edit/delete, a "New X" button, and the
 * load/empty/error states. Each resource just supplies its data accessors.
 */
export function AdminResourceList<T>({
  title,
  newHref,
  newLabel,
  emptyLabel,
  list,
  remove,
  editHref,
  getId,
  getImage,
  getTitle,
  renderSubtitle,
  extraAction,
  headerLink,
  backHref = "/admin",
  backLabel = "Dashboard",
}: {
  title: string;
  newHref: string;
  newLabel: string;
  emptyLabel: string;
  list: () => Promise<T[]>;
  remove: (id: string) => Promise<unknown>;
  editHref: (item: T) => string;
  getId: (item: T) => string;
  getImage: (item: T) => string | undefined;
  getTitle: (item: T) => string;
  renderSubtitle: (item: T) => ReactNode;
  /** Optional secondary link per row, e.g. "Products →" for a category row. */
  extraAction?: (item: T) => { href: string; label: string };
  /** Optional link shown once, next to the "New X" button — e.g. "Manage categories". */
  headerLink?: { href: string; label: string };
  backHref?: string;
  backLabel?: string;
}) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    list()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : `Could not load ${title.toLowerCase()}.`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (item: T) => {
    const id = getId(item);
    if (!confirm(`Delete "${getTitle(item)}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await remove(id);
      setItems((prev) => prev?.filter((i) => getId(i) !== id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <BackLink href={backHref} label={backLabel} />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="label">Content</p>
          <h1 className="display mt-3 text-3xl">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {headerLink && (
            <Link href={headerLink.href} className="text-sm font-medium text-graphite hover:text-ink">
              {headerLink.label}
            </Link>
          )}
          <Link href={newHref} className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-paper">
            <Plus size={16} /> {newLabel}
          </Link>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-accent-strong">{error}</p>}

      {items === null && !error ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-graphite">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {items?.length === 0 && <p className="py-8 text-sm text-graphite">{emptyLabel}</p>}
          {items?.map((item) => {
            const id = getId(item);
            const image = getImage(item);
            return (
              <div key={id} className="flex items-center gap-4 py-4">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                  {image && <Image src={image} alt="" fill unoptimized sizes="80px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{getTitle(item)}</p>
                  <p className="truncate text-sm text-graphite">{renderSubtitle(item)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {extraAction && (
                    <Link href={extraAction(item).href} className="label whitespace-nowrap text-[10px] text-accent-strong hover:underline">
                      {extraAction(item).label}
                    </Link>
                  )}
                  <Link
                    href={editHref(item)}
                    className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-ink hover:text-ink"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    disabled={deletingId === id}
                    className="grid h-9 w-9 place-items-center border border-line text-graphite transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingId === id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
