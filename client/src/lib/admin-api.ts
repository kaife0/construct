/**
 * Client-side calls to the admin API. All paths are relative (/api/*) so they
 * go through the same-origin proxy carrying the httpOnly session cookie.
 */
import type { MaterialRates } from "@/lib/rates";
import type { SiteSettings } from "@/lib/site";

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error ?? `Request failed (${res.status}).`;
  } catch {
    return `Request failed (${res.status}).`;
  }
}

async function jsonRequest<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

/**
 * Bust the public site's ISR cache for the given tags right after a mutation,
 * so edits show up immediately instead of waiting out the revalidate window.
 * Best-effort: a failure here must not block the admin flow — the write
 * already succeeded, and the cache will still catch up on its own timer.
 */
async function revalidate(tags: string[]): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
  } catch {
    // ignore — see doc comment
  }
}

/** Standard list/get/create/update/delete client for a slugged admin resource. */
function crudClient<Input, Rec>(endpoint: string, tag: string) {
  const base = `/api/${endpoint}`;
  return {
    list: () => jsonRequest<Rec[]>(base, "GET"),
    get: (id: string) => jsonRequest<Rec>(`${base}/${id}`, "GET"),
    create: async (data: Input) => {
      const result = await jsonRequest<Rec>(base, "POST", data);
      await revalidate([tag]);
      return result;
    },
    update: async (id: string, data: Input) => {
      const result = await jsonRequest<Rec>(`${base}/${id}`, "PUT", data);
      await revalidate([tag]);
      return result;
    },
    remove: async (id: string) => {
      const result = await jsonRequest<{ ok: true }>(`${base}/${id}`, "DELETE");
      await revalidate([tag]);
      return result;
    },
  };
}

/** Upload an image, returns its stored URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error(await parseError(res));
  const data: { url: string } = await res.json();
  return data.url;
}

// ---- Services --------------------------------------------------------------

export type ServiceInput = {
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  image: string;
};
export type ServiceRecord = ServiceInput & { _id: string; slug: string; order: number };

const services = crudClient<ServiceInput, ServiceRecord>("services", "services");
export const listServices = services.list;
export const getService = services.get;
export const createService = services.create;
export const updateService = services.update;
export const deleteService = services.remove;

// ---- Ready-made Plans -------------------------------------------------------

export type PlanInput = {
  title: string;
  config: string;
  area: number;
  beds: number;
  baths: number;
  floors: number;
  facing: string;
  tag?: string;
  image: string;
  images?: string[];
  description: string;
};
export type PlanRecord = PlanInput & { _id: string; slug: string; order: number };

const plans = crudClient<PlanInput, PlanRecord>("plans", "plans");
export const listPlans = plans.list;
export const getPlan = plans.get;
export const createPlan = plans.create;
export const updatePlan = plans.update;
export const deletePlan = plans.remove;

// ---- Digital Product Categories --------------------------------------------

export type DigitalProductCategoryInput = {
  title: string;
  summary: string;
  description: string;
  image: string;
  showPlansCatalog: boolean;
};
export type DigitalProductCategoryRecord = DigitalProductCategoryInput & { _id: string; slug: string; order: number };

const digitalProductCategories = crudClient<DigitalProductCategoryInput, DigitalProductCategoryRecord>(
  "digital-product-categories",
  "digital-products"
);
export const listDigitalProductCategories = digitalProductCategories.list;
export const getDigitalProductCategory = digitalProductCategories.get;
export const createDigitalProductCategory = digitalProductCategories.create;
export const updateDigitalProductCategory = digitalProductCategories.update;
export const deleteDigitalProductCategory = digitalProductCategories.remove;

// ---- Digital Products (items listed within a category) ---------------------

export type DigitalProductInput = {
  categoryId: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price?: number;
  features: string[];
};
export type DigitalProductRecord = DigitalProductInput & { _id: string; slug: string; order: number };

const digitalProducts = crudClient<DigitalProductInput, DigitalProductRecord>("digital-products", "digital-product-items");
export const listDigitalProducts = (categoryId: string) =>
  jsonRequest<DigitalProductRecord[]>(`/api/digital-products?categoryId=${categoryId}`, "GET");
export const getDigitalProduct = digitalProducts.get;
export const createDigitalProduct = digitalProducts.create;
export const updateDigitalProduct = digitalProducts.update;
export const deleteDigitalProduct = digitalProducts.remove;

// ---- Our Work (Projects) ----------------------------------------------

export type ProjectInput = {
  title: string;
  location: string;
  status: "completed" | "in-progress";
  year: string;
  image: string;
  images?: string[];
  description?: string;
  area?: number;
  floors?: number;
  type?: string;
  budget?: number;
};
export type ProjectRecord = ProjectInput & { _id: string; slug: string; order: number };

const projects = crudClient<ProjectInput, ProjectRecord>("projects", "projects");
export const listProjects = projects.list;
export const getProject = projects.get;
export const createProject = projects.create;
export const updateProject = projects.update;
export const deleteProject = projects.remove;

// ---- Blog Categories ---------------------------------------------------

export type BlogCategoryInput = { title: string };
export type BlogCategoryRecord = BlogCategoryInput & { _id: string; slug: string; order: number };

const blogCategories = crudClient<BlogCategoryInput, BlogCategoryRecord>("blog-categories", "blog-categories");
export const listBlogCategories = blogCategories.list;
export const getBlogCategory = blogCategories.get;
export const createBlogCategory = blogCategories.create;
export const updateBlogCategory = blogCategories.update;
export const deleteBlogCategory = blogCategories.remove;

// ---- Blog Posts ---------------------------------------------------------

export type BlogPostInput = {
  categoryId: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readMins?: number;
  published: boolean;
};
export type BlogPostRecord = BlogPostInput & { _id: string; slug: string; order: number };

const blogPosts = crudClient<BlogPostInput, BlogPostRecord>("blog-posts", "posts");
export const listBlogPosts = () => jsonRequest<BlogPostRecord[]>("/api/blog-posts/admin", "GET");
export const getBlogPost = blogPosts.get;
export const createBlogPost = blogPosts.create;
export const updateBlogPost = blogPosts.update;
export const deleteBlogPost = blogPosts.remove;

// ---- Inquiries ---------------------------------------------------------

export type InquiryStatus = "new" | "contacted" | "closed";

export type InquiryRecord = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export const listInquiries = () => jsonRequest<InquiryRecord[]>("/api/inquiries", "GET");
export const setInquiryStatus = (id: string, status: InquiryStatus) =>
  jsonRequest<InquiryRecord>(`/api/inquiries/${id}`, "PATCH", { status });
export const deleteInquiry = (id: string) => jsonRequest<{ ok: true }>(`/api/inquiries/${id}`, "DELETE");

// ---- Calculator Rates (singleton) ------------------------------------------

export type CalculatorRatesRecord = MaterialRates & { _id: string };

export const getCalculatorRates = () => jsonRequest<CalculatorRatesRecord>("/api/calculator-rates", "GET");
export const updateCalculatorRates = async (data: MaterialRates) => {
  const result = await jsonRequest<CalculatorRatesRecord>("/api/calculator-rates", "PUT", data);
  await revalidate(["calculator-rates"]);
  return result;
};

// ---- Site Settings (singleton) ---------------------------------------------

export type SiteSettingsRecord = SiteSettings & { _id: string };

export const getSiteSettings = () => jsonRequest<SiteSettingsRecord>("/api/site-settings", "GET");
export const updateSiteSettings = async (data: SiteSettings) => {
  const result = await jsonRequest<SiteSettingsRecord>("/api/site-settings", "PUT", data);
  await revalidate(["site-settings"]);
  return result;
};
