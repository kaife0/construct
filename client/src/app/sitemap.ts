import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import {
  getServices,
  getPlans,
  getProjects,
  getDigitalProductCategories,
  getDigitalProducts,
  getPosts,
  getBlogCategories,
} from "@/lib/api";

/** Dynamic sitemap — static routes plus every DB-backed detail page, pulled from the API. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/digital-products"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/calculators"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const [services, plans, projects, categories, posts, blogCategories] = await Promise.all([
    getServices(),
    getPlans(),
    getProjects(),
    getDigitalProductCategories(),
    getPosts(),
    getBlogCategories(),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const planRoutes: MetadataRoute.Sitemap = plans.map((p) => ({
    url: absoluteUrl(`/plans/${p.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/about/work/${p.slug}`),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  // Category pages + every product listed within each category.
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/digital-products/${c.slug}`),
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const productRouteGroups = await Promise.all(
    categories.map(async (c) => {
      const products = await getDigitalProducts(c.slug);
      return products.map((prod) => ({
        url: absoluteUrl(`/digital-products/${c.slug}/${prod.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    })
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = blogCategories.map((c) => ({
    url: absoluteUrl(`/blog/category/${c.slug}`),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...planRoutes,
    ...projectRoutes,
    ...categoryRoutes,
    ...productRouteGroups.flat(),
    ...postRoutes,
    ...blogCategoryRoutes,
  ];
}
