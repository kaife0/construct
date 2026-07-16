import { Router } from "express";
import type { Model } from "mongoose";
import type { ZodObject, ZodRawShape } from "zod";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { ah } from "./asyncHandler.js";

/** For one-document collections (CalculatorRates, SiteSettings): public read (lazily created) + admin upsert. */
export function createSingletonRouter<T extends ZodRawShape>(options: {
  model: Model<any>;
  schema: ZodObject<T>;
  partialUpdate?: boolean; // default false — PUT validates the full schema instead of a partial
}) {
  const { model, schema, partialUpdate = false } = options;
  const router = Router();

  router.get(
    "/",
    ah(async (_req, res) => {
      let doc = await model.findOne();
      if (!doc) doc = await model.create({});
      res.json(doc);
    })
  );

  router.put(
    "/",
    requireAdmin,
    ah(async (req, res) => {
      const parsed = (partialUpdate ? schema.partial() : schema).safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
        return;
      }
      const updated = await model.findOneAndUpdate({}, parsed.data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
      res.json(updated);
    })
  );

  return router;
}
