import { Router } from "express";
import { z } from "zod";
import { DigitalProductCategory } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "../lib/slug.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

const categorySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().min(1, "Description is required."),
  image: z.string().trim().min(1, "Image is required."),
  showPlansCatalog: z.boolean().optional(),
  order: z.number().int().optional(),
});

// ---- Public reads ----------------------------------------------------------

router.get("/", async (_req, res) => {
  const categories = await DigitalProductCategory.find().sort({ order: 1, createdAt: 1 });
  res.json(categories);
});

router.get("/:id", async (req, res) => {
  const category = await DigitalProductCategory.findById(req.params.id);
  if (!category) {
    res.status(404).json({ error: "Category not found." });
    return;
  }
  res.json(category);
});

// ---- Admin writes ----------------------------------------------------------

router.post("/", requireAdmin, async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const data = parsed.data;
  const slug = await uniqueSlug(DigitalProductCategory, data.title);
  const count = await DigitalProductCategory.estimatedDocumentCount();
  const category = await DigitalProductCategory.create({ ...data, slug, order: data.order ?? count });
  res.status(201).json(category);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const existing = await DigitalProductCategory.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Category not found." });
    return;
  }

  const data = parsed.data;
  if (data.title && data.title !== existing.title) {
    existing.slug = await uniqueSlug(DigitalProductCategory, data.title, existing.id);
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
  const deleted = await DigitalProductCategory.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Category not found." });
    return;
  }
  await storage.remove(deleted.image);
  res.json({ ok: true });
});

export default router;
