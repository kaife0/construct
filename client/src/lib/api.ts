/**
 * Server-side data fetching from the Express backend (../server).
 * Called from Server Components. Uses time-based revalidation so admin edits
 * appear on the public site within the window without a rebuild — and the
 * admin panel triggers an immediate on-demand revalidation on every write
 * (see /api/revalidate), so edits actually show up right away in practice.
 *
 * On failure it returns an empty list rather than throwing, so a transient
 * backend hiccup degrades gracefully instead of crashing the page.
 */
import type { Service, Plan, DigitalProductCategory } from "@/lib/content";

const API_BASE = process.env.API_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 30;

async function fetchList<Doc>(endpoint: string, tag: string): Promise<Doc[]> {
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}`, { next: { revalidate: REVALIDATE_SECONDS, tags: [tag] } });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

/** Every resource stores `order`; the public "01", "02"… index is derived from it, not stored. */
function withDisplayIndex<D extends { order: number }>(docs: D[]): (Omit<D, "order"> & { index: string })[] {
  return docs.map((d, i) => ({ ...d, index: String(i + 1).padStart(2, "0") }));
}

function findBySlug<T extends { slug: string }>(items: T[], slug: string): T | null {
  return items.find((i) => i.slug === slug) ?? null;
}

type ServiceDoc = Omit<Service, "index"> & { order: number };

export async function getServices(): Promise<Service[]> {
  return withDisplayIndex(await fetchList<ServiceDoc>("services", "services"));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return findBySlug(await getServices(), slug);
}

type PlanDoc = Omit<Plan, "index"> & { order: number };

export async function getPlans(): Promise<Plan[]> {
  return withDisplayIndex(await fetchList<PlanDoc>("plans", "plans"));
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  return findBySlug(await getPlans(), slug);
}

type DigitalProductCategoryDoc = Omit<DigitalProductCategory, "index"> & { order: number };

export async function getDigitalProductCategories(): Promise<DigitalProductCategory[]> {
  return withDisplayIndex(await fetchList<DigitalProductCategoryDoc>("digital-product-categories", "digital-products"));
}

export async function getDigitalProductCategoryBySlug(slug: string): Promise<DigitalProductCategory | null> {
  return findBySlug(await getDigitalProductCategories(), slug);
}
