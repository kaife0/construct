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

type PlanDoc = {
  slug: string;
  title: string;
  config: string;
  area: number;
  beds: number;
  baths: number;
  floors: number;
  facing: string;
  tag?: string;
  image: string;
  description: string;
  order: number;
};

export async function getPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${API_BASE}/api/plans`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["plans"] },
    });
    if (!res.ok) return [];
    const docs: PlanDoc[] = await res.json();
    return docs.map((d, i) => ({
      slug: d.slug,
      index: String(i + 1).padStart(2, "0"),
      title: d.title,
      config: d.config,
      area: d.area,
      beds: d.beds,
      baths: d.baths,
      floors: d.floors,
      facing: d.facing,
      tag: d.tag,
      image: d.image,
      description: d.description,
    }));
  } catch {
    return [];
  }
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const plans = await getPlans();
  return plans.find((p) => p.slug === slug) ?? null;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) ?? null;
}

type DigitalProductCategoryDoc = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  showPlansCatalog: boolean;
  order: number;
};

export async function getDigitalProductCategories(): Promise<DigitalProductCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/digital-product-categories`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["digital-products"] },
    });
    if (!res.ok) return [];
    const docs: DigitalProductCategoryDoc[] = await res.json();
    return docs.map((d, i) => ({
      slug: d.slug,
      index: String(i + 1).padStart(2, "0"),
      title: d.title,
      summary: d.summary,
      description: d.description,
      image: d.image,
      showPlansCatalog: d.showPlansCatalog,
    }));
  } catch {
    return [];
  }
}

export async function getDigitalProductCategoryBySlug(slug: string): Promise<DigitalProductCategory | null> {
  const categories = await getDigitalProductCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
