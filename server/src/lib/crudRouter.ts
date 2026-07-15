import { Router } from "express";
import type { Model } from "mongoose";
import type { ZodObject, ZodRawShape } from "zod";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { uniqueSlug } from "./slug.js";
import { storage } from "./storage/index.js";
import { removeStaleImages } from "./imageCleanup.js";

/**
 * Every slugged, admin-managed resource (Service, Plan, DigitalProductCategory, …)
 * follows the exact same shape: public list (sorted by order) + get-by-id,
 * admin create/update (auto slug, image cleanup on replace) + delete (image
 * cleanup). This factory builds that router once instead of per resource.
 *
 * `Model<any>` is deliberate — resources are heterogeneous, and fully typing
 * a generic Mongoose CRUD factory isn't worth it for internal wiring code.
 */
export function createCrudRouter<T extends ZodRawShape>(options: {
  model: Model<any>;
  schema: ZodObject<T>;
  noun: string; // used in "<noun> not found." messages
  hasImage?: boolean; // default true — clean up the image file on replace/delete
  hasGallery?: boolean; // default false — also clean up the `images: string[]` gallery on replace/delete
}) {
  const { model, schema, noun, hasImage = true, hasGallery = false } = options;
  const router = Router();
  const notFound = (res: import("express").Response) => res.status(404).json({ error: `${noun} not found.` });

  router.get("/", async (_req, res) => {
    res.json(await model.find().sort({ order: 1, createdAt: 1 }));
  });

  router.get("/:id", async (req, res) => {
    const doc = await model.findById(req.params.id);
    if (!doc) return notFound(res);
    res.json(doc);
  });

  router.post("/", requireAdmin, async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
      return;
    }
    const data = parsed.data as Record<string, unknown>;
    const slug = await uniqueSlug(model, data.title as string);
    const count = await model.estimatedDocumentCount();
    const doc = await model.create({ ...data, slug, order: data.order ?? count });
    res.status(201).json(doc);
  });

  router.put("/:id", requireAdmin, async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
      return;
    }
    const existing = await model.findById(req.params.id);
    if (!existing) return notFound(res);

    const data = parsed.data as Record<string, unknown>;
    if (data.title && data.title !== existing.title) {
      existing.slug = await uniqueSlug(model, data.title as string, existing.id);
    }
    const oldImage = hasImage ? existing.image : undefined;
    const oldImages = hasGallery ? existing.images : undefined;
    Object.assign(existing, data);
    await existing.save();

    if (hasImage && data.image && data.image !== oldImage) {
      await storage.remove(oldImage);
    }
    if (hasGallery && data.images) {
      await removeStaleImages(storage, oldImages, data.images as string[]);
    }
    res.json(existing);
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    const deleted = await model.findByIdAndDelete(req.params.id);
    if (!deleted) return notFound(res);
    if (hasImage) await storage.remove(deleted.image);
    if (hasGallery) await Promise.all((deleted.images ?? []).map((img: string) => storage.remove(img)));
    res.json({ ok: true });
  });

  return router;
}
