import { Router } from "express";
import { z } from "zod";
import { Plan } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "../lib/slug.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

const planSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  config: z.string().trim().min(1, "Configuration is required."),
  area: z.number().positive("Area must be a positive number."),
  beds: z.number().int().nonnegative(),
  baths: z.number().int().nonnegative(),
  floors: z.number().int().positive(),
  facing: z.string().trim().min(1, "Facing is required."),
  tag: z.string().trim().optional().or(z.literal("")),
  image: z.string().trim().min(1, "Image is required."),
  description: z.string().trim().min(1, "Description is required."),
  order: z.number().int().optional(),
});

// ---- Public reads ----------------------------------------------------------

router.get("/", async (_req, res) => {
  const plans = await Plan.find().sort({ order: 1, createdAt: 1 });
  res.json(plans);
});

router.get("/:id", async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }
  res.json(plan);
});

// ---- Admin writes ----------------------------------------------------------

router.post("/", requireAdmin, async (req, res) => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const data = parsed.data;
  const slug = await uniqueSlug(Plan, data.title);
  const count = await Plan.estimatedDocumentCount();
  const plan = await Plan.create({ ...data, slug, order: data.order ?? count });
  res.status(201).json(plan);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = planSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const existing = await Plan.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }

  const data = parsed.data;
  if (data.title && data.title !== existing.title) {
    existing.slug = await uniqueSlug(Plan, data.title, existing.id);
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
  const deleted = await Plan.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Plan not found." });
    return;
  }
  await storage.remove(deleted.image);
  res.json({ ok: true });
});

export default router;
