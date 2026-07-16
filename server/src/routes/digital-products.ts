import { z } from "zod";
import { DigitalProduct, DigitalProductCategory } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  categoryId: z.string().trim().min(1, "Category is required."),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  image: z.string().trim().min(1, "Image is required."),
  images: z.array(z.string().trim().min(1)).default([]),
  price: z.number().nonnegative().optional(),
  features: z.array(z.string().trim().min(1)).default([]),
  order: z.number().int().optional(),
});

/**
 * GET /?category=<slug> — public, filter by category slug
 * GET /?categoryId=<id> — admin convenience, filter by id directly
 * Omit both to list everything.
 */
async function listFilter(req: import("express").Request) {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;
  if (categoryId) return { categoryId };
  if (!categorySlug) return {};

  const category = await DigitalProductCategory.findOne({ slug: categorySlug }).select("_id");
  return category ? { categoryId: category._id } : null;
}

export default createCrudRouter({
  model: DigitalProduct,
  schema,
  noun: "Product",
  hasGallery: true,
  listFilter,
  refCheck: { field: "categoryId", model: DigitalProductCategory, message: "That category no longer exists." },
  orderScopeField: "categoryId",
});
