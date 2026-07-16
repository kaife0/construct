import { z } from "zod";
import { BlogPost, BlogCategory } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  categoryId: z.string().trim().min(1, "Category is required."),
  title: z.string().trim().min(1, "Title is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  content: z.string().trim().default(""),
  image: z.string().trim().min(1, "Image is required."),
  readMins: z.number().int().positive().optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

/** GET /?category=<slug> filters to published posts in that category; omit for all published posts. */
async function listFilter(req: import("express").Request) {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const filter: Record<string, unknown> = { published: true };
  if (!categorySlug) return filter;

  const category = await BlogCategory.findOne({ slug: categorySlug }).select("_id");
  if (!category) return null;
  filter.categoryId = category._id;
  return filter;
}

export default createCrudRouter({
  model: BlogPost,
  schema,
  noun: "Post",
  sort: { order: 1, createdAt: -1 },
  listFilter,
  listPopulate: { path: "categoryId", select: "title slug" },
  adminList: true,
  detailRequiresAdmin: true,
  refCheck: { field: "categoryId", model: BlogCategory, message: "That category no longer exists." },
});
