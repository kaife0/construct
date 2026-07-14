import { Router } from "express";
import { z } from "zod";
import { DigitalProduct, DigitalProductCategory } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "../lib/slug.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

const schema = z.object({
  categoryId: z.string().trim().min(1, "Category is required."),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  image: z.string().trim().min(1, "Image is required."),
  price: z.number().nonnegative().optional(),
  order: z.number().int().optional(),
});

// ---- Public reads -----------------------------------------------------------

/**
 * GET /api/digital-products?category=<slug>   — public, filter by category slug
 * GET /api/digital-products?categoryId=<id>    — admin convenience, filter by id directly
 * Omit both to list everything.
 */
router.get("/", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

  let filter = {};
  if (categoryId) {
    filter = { categoryId };
  } else if (categorySlug) {
    const category = await DigitalProductCategory.findOne({ slug: categorySlug }).select("_id");
    if (!category) {
      res.json([]);
      return;
    }
    filter = { categoryId: category._id };
  }
  const products = await DigitalProduct.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await DigitalProduct.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  res.json(product);
});

// ---- Admin writes ------------------------------------------------------------

router.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const data = parsed.data;
  const category = await DigitalProductCategory.findById(data.categoryId);
  if (!category) {
    res.status(400).json({ error: "That category no longer exists." });
    return;
  }
  const slug = await uniqueSlug(DigitalProduct, data.title);
  const count = await DigitalProduct.countDocuments({ categoryId: data.categoryId });
  const product = await DigitalProduct.create({ ...data, slug, order: data.order ?? count });
  res.status(201).json(product);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const existing = await DigitalProduct.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  const data = parsed.data;
  if (data.title && data.title !== existing.title) {
    existing.slug = await uniqueSlug(DigitalProduct, data.title, existing.id);
  }
  const oldImage = existing.image;
  Object.assign(existing, data);
  await existing.save();

  if (data.image && data.image !== oldImage) {
    await storage.remove(oldImage);
  }
  res.json(existing);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const deleted = await DigitalProduct.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Product not found." });
    return;
  }
  await storage.remove(deleted.image);
  res.json({ ok: true });
});

export default router;
