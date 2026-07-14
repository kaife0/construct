import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { Inquiry } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const submitSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().min(4, "A valid phone number is required.").max(30),
  email: z.string().trim().email().optional().or(z.literal("")),
  service: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please add a short message.").max(2000),
});

// Public submissions are spam-prone — cap per IP.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

// ---- Public submit ---------------------------------------------------------

router.post("/", submitLimiter, async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." });
    return;
  }
  await Inquiry.create(parsed.data);
  res.status(201).json({ ok: true });
});

// ---- Admin inbox -----------------------------------------------------------

router.get("/", requireAdmin, async (_req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const status = z.enum(["new", "contacted", "closed"]).safeParse(req.body?.status);
  if (!status.success) {
    res.status(400).json({ error: "Invalid status." });
    return;
  }
  const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: status.data }, { new: true });
  if (!updated) {
    res.status(404).json({ error: "Inquiry not found." });
    return;
  }
  res.json(updated);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const deleted = await Inquiry.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Inquiry not found." });
    return;
  }
  res.json({ ok: true });
});

export default router;
