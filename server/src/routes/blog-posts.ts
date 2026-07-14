import { Router } from "express";
import { z } from "zod";
import { BlogPost, BlogCategory } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "../lib/slug.js";
import { storage } from "../lib/storage/index.js";

const router = Router();

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

// ---- Public reads -----------------------------------------------------------

/** GET /api/blog-posts?category=<category-slug> — published only. */
router.get("/", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const filter: Record<string, unknown> = { published: true };

  if (categorySlug) {
    const category = await BlogCategory.findOne({ slug: categorySlug }).select("_id");
    if (!category) {
      res.json([]);
      return;
    }
    filter.categoryId = category._id;
  }

  // Populated here (unlike the admin routes below) because the public
  // frontend needs the category's title/slug for display, whereas the admin
  // form needs the raw categoryId to bind its select dropdown.
  const posts = await BlogPost.find(filter).sort({ order: 1, createdAt: -1 }).populate("categoryId", "title slug");
  res.json(posts);
});

// ---- Admin reads (drafts included) ------------------------------------------

/** GET /api/blog-posts/admin — every post, published or not, for the admin list. */
router.get("/admin", requireAdmin, async (_req, res) => {
  const posts = await BlogPost.find().sort({ order: 1, createdAt: -1 });
  res.json(posts);
});

router.get("/:id", requireAdmin, async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found." });
    return;
  }
  res.json(post);
});

// ---- Admin writes ------------------------------------------------------------

router.post("/", requireAdmin, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const data = parsed.data;
  const category = await BlogCategory.findById(data.categoryId);
  if (!category) {
    res.status(400).json({ error: "That category no longer exists." });
    return;
  }
  const slug = await uniqueSlug(BlogPost, data.title);
  const count = await BlogPost.estimatedDocumentCount();
  const post = await BlogPost.create({ ...data, slug, order: data.order ?? count });
  res.status(201).json(post);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const existing = await BlogPost.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Post not found." });
    return;
  }

  const data = parsed.data;
  if (data.title && data.title !== existing.title) {
    existing.slug = await uniqueSlug(BlogPost, data.title, existing.id);
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
  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Post not found." });
    return;
  }
  await storage.remove(deleted.image);
  res.json({ ok: true });
});

export default router;
