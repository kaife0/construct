/**
 * Server-side data fetching from the Express backend (../server).
 * Called from Server Components. Uses time-based revalidation so admin edits
 * appear on the public site within the window without a rebuild.
 *
 * On failure it returns an empty list rather than throwing, so a transient
 * backend hiccup degrades gracefully instead of crashing the page.
 */
import type { Service } from "@/lib/content";

const API_BASE = process.env.API_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 30;

type ServiceDoc = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  image: string;
  order: number;
};

export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/api/services`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["services"] },
    });
    if (!res.ok) return [];
    const docs: ServiceDoc[] = await res.json();
    // Display index ("01", "02"…) is derived from order, not stored.
    return docs.map((d, i) => ({
      slug: d.slug,
      index: String(i + 1).padStart(2, "0"),
      title: d.title,
      summary: d.summary,
      description: d.description,
      deliverables: d.deliverables,
      image: d.image,
    }));
  } catch {
    return [];
  }
}
