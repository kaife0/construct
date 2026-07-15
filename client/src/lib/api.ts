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
import type { Service, Plan, DigitalProductCategory, DigitalProduct, Post, BlogCategory, Project } from "@/lib/content";
import { materialRates, type MaterialRates } from "@/lib/rates";

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

type DigitalProductDoc = Omit<DigitalProduct, "index"> & { order: number };

/** Products listed within one category — e.g. the CAD blocks inside a "CAD Blocks" category. */
export async function getDigitalProducts(categorySlug: string): Promise<DigitalProduct[]> {
  return withDisplayIndex(
    await fetchList<DigitalProductDoc>(`digital-products?category=${encodeURIComponent(categorySlug)}`, "digital-product-items")
  );
}

export async function getDigitalProductBySlug(categorySlug: string, productSlug: string): Promise<DigitalProduct | null> {
  return findBySlug(await getDigitalProducts(categorySlug), productSlug);
}

type BlogCategoryDoc = { slug: string; title: string; order: number };

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const docs = await fetchList<BlogCategoryDoc>("blog-categories", "blog-categories");
  return docs.map(({ slug, title }) => ({ slug, title }));
}

type PostDoc = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readMins: number;
  createdAt: string;
  categoryId: { title: string; slug: string } | null;
};

/** Published posts only. Pass a category slug to filter, e.g. from /blog/category/[slug]. */
export async function getPosts(categorySlug?: string): Promise<Post[]> {
  const endpoint = categorySlug ? `blog-posts?category=${encodeURIComponent(categorySlug)}` : "blog-posts";
  const docs = await fetchList<PostDoc>(endpoint, "posts");
  return docs.map((d) => ({
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    category: d.categoryId?.title ?? "General",
    date: d.createdAt,
    readMins: d.readMins,
    image: d.image,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return findBySlug(await getPosts(), slug);
}

type ProjectDoc = Project & { order: number };

/** Completed and in-progress projects shown on the About page's "Our work" section. */
export async function getProjects(): Promise<Project[]> {
  return fetchList<ProjectDoc>("projects", "projects");
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return findBySlug(await getProjects(), slug);
}

/** Falls back to the hardcoded defaults on failure so the calculators never break. */
export async function getCalculatorRates(): Promise<MaterialRates> {
  try {
    const res = await fetch(`${API_BASE}/api/calculator-rates`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["calculator-rates"] },
    });
    if (!res.ok) return materialRates;
    return await res.json();
  } catch {
    return materialRates;
  }
}
