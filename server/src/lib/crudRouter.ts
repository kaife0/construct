import { Router, type Request, type Response } from "express";
import type { Model } from "mongoose";
import type { ZodObject, ZodRawShape } from "zod";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { ah } from "./asyncHandler.js";
import { uniqueSlug } from "./slug.js";
import { storage } from "./storage/index.js";
import { removeStaleImages } from "./imageCleanup.js";

/**
 * Every slugged, admin-managed resource (Service, Plan, BlogPost, …) follows the same shape: a
 * public list (sorted by order) + get-by-id, admin create/update (auto slug, image cleanup on
 * replace) + delete (image cleanup). This factory builds that router once instead of per resource.
 * `refCheck`/`listFilter`/`adminList` cover the few resources that need a category relationship.
 */
export function createCrudRouter<T extends ZodRawShape>(options: {
  model: Model<any>;
  schema: ZodObject<T>;
  noun: string; // used in "<noun> not found." messages
  hasImage?: boolean; // default true — clean up the image file on replace/delete
  hasGallery?: boolean; // default false — also clean up the `images: string[]` gallery on replace/delete
  sort?: Record<string, 1 | -1>; // default { order: 1, createdAt: 1 }
  listFilter?: (req: Request) => Promise<Record<string, unknown> | null>; // null => respond [] without querying
  listPopulate?: { path: string; select: string };
  adminList?: boolean; // adds GET /admin (requireAdmin) — every doc, unfiltered
  detailRequiresAdmin?: boolean; // default false — gate GET /:id behind requireAdmin
  refCheck?: { field: string; model: Model<any>; message: string }; // validated on create only
  orderScopeField?: string; // scope the auto-`order` counter to docs sharing this field's value
}) {
  const {
    model,
    schema,
    noun,
    hasImage = true,
    hasGallery = false,
    sort = { order: 1, createdAt: 1 },
    listFilter,
    listPopulate,
    adminList = false,
    detailRequiresAdmin = false,
    refCheck,
    orderScopeField,
  } = options;
  const router = Router();
  const notFound = (res: Response) => res.status(404).json({ error: `${noun} not found.` });

  router.get(
    "/",
    ah(async (req, res) => {
      const filter = listFilter ? await listFilter(req) : {};
      if (filter === null) {
        res.json([]);
        return;
      }
      let query = model.find(filter).sort(sort);
      if (listPopulate) query = query.populate(listPopulate.path, listPopulate.select);
      res.json(await query);
    })
  );

  if (adminList) {
    router.get(
      "/admin",
      requireAdmin,
      ah(async (_req, res) => {
        res.json(await model.find().sort(sort));
      })
    );
  }

  router.get(
    "/:id",
    ...(detailRequiresAdmin ? [requireAdmin] : []),
    ah(async (req, res) => {
      const doc = await model.findById(req.params.id);
      if (!doc) return notFound(res);
      res.json(doc);
    })
  );

  router.post(
    "/",
    requireAdmin,
    ah(async (req, res) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
        return;
      }
      const data = parsed.data as Record<string, unknown>;

      if (refCheck) {
        const ref = await refCheck.model.findById(data[refCheck.field]);
        if (!ref) {
          res.status(400).json({ error: refCheck.message });
          return;
        }
      }

      const slug = await uniqueSlug(model, data.title as string);
      const count = orderScopeField
        ? await model.countDocuments({ [orderScopeField]: data[orderScopeField] })
        : await model.estimatedDocumentCount();
      const doc = await model.create({ ...data, slug, order: data.order ?? count });
      res.status(201).json(doc);
    })
  );

  router.put(
    "/:id",
    requireAdmin,
    ah(async (req, res) => {
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
    })
  );

  router.delete(
    "/:id",
    requireAdmin,
    ah(async (req, res) => {
      const deleted = await model.findByIdAndDelete(req.params.id);
      if (!deleted) return notFound(res);
      if (hasImage) await storage.remove(deleted.image);
      if (hasGallery) await Promise.all((deleted.images ?? []).map((img: string) => storage.remove(img)));
      res.json({ ok: true });
    })
  );

  return router;
}
