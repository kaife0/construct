import { Router } from "express";
import { z } from "zod";
import { SiteSettings } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const schema = z.object({
  profile: z.object({
    name: z.string().trim().min(1, "Name is required."),
    role: z.string().trim().min(1, "Role is required."),
    intro: z.string().trim().min(1, "Intro is required."),
    bio: z.array(z.string().trim().min(1)).default([]),
    credentials: z.array(z.string().trim().min(1)).default([]),
    stats: z.object({
      projects: z.number().nonnegative(),
      experienceYears: z.number().nonnegative(),
      cities: z.number().nonnegative(),
    }),
  }),
  achievements: z
    .array(
      z.object({
        year: z.string().trim().min(1, "Year is required."),
        title: z.string().trim().min(1, "Title is required."),
        desc: z.string().trim().min(1, "Description is required."),
      })
    )
    .default([]),
  contact: z.object({
    phone: z.string().trim().min(1, "Phone is required."),
    email: z.string().trim().email("A valid email is required."),
    whatsappNumber: z.string().trim().min(1, "WhatsApp number is required."),
    location: z.string().trim().min(1, "Location is required."),
  }),
  socials: z.object({
    instagram: z.string().trim().optional().or(z.literal("")),
    linkedin: z.string().trim().optional().or(z.literal("")),
    youtube: z.string().trim().optional().or(z.literal("")),
  }),
});

// ---- Public read -------------------------------------------------------

router.get("/", async (_req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  res.json(settings);
});

// ---- Admin update --------------------------------------------------------

router.put("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const updated = await SiteSettings.findOneAndUpdate({}, parsed.data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(updated);
});

export default router;
