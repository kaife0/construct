import { Router } from "express";
import { z } from "zod";
import { Service } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "../lib/slug.js";

const router = Router();

const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().min(1, "Description is required."),
  deliverables: z.array(z.string().trim().min(1)).default([]),
  image: z.string().trim().min(1, "Image is required."),
  order: z.number().int().optional(),
});

// ---- Public reads ----------------------------------------------------------

router.get("/", async (_req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: 1 });
  res.json(services);
});

router.get("/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404).json({ error: "Service not found." });
    return;
  }
  res.json(service);
});

// ---- Admin writes ----------------------------------------------------------

router.post("/", requireAdmin, async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const data = parsed.data;
  const slug = await uniqueSlug(Service, data.title);
  const count = await Service.estimatedDocumentCount();
  const service = await Service.create({ ...data, slug, order: data.order ?? count });
  res.status(201).json(service);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const existing = await Service.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Service not found." });
    return;
  }

  const data = parsed.data;
  if (data.title && data.title !== existing.title) {
    existing.slug = await uniqueSlug(Service, data.title, existing.id);
  }
  Object.assign(existing, data);
  await existing.save();
  res.json(existing);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Service not found." });
    return;
  }
  res.json({ ok: true });
});

export default router;
