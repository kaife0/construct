import slugify from "slugify";
import type { Model } from "mongoose";

const toSlug = (s: string) => slugify(s, { lower: true, strict: true, trim: true });

/**
 * Produce a slug from `title` that is unique within the given collection.
 * If a doc is being updated, pass its id as `excludeId` so it doesn't collide
 * with itself.
 */
export async function uniqueSlug(
  model: Model<any>,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = toSlug(title) || "item";
  let candidate = base;
  let n = 1;
  // Loop until we find a slug not used by another document.
  while (true) {
    const existing = await model.findOne({ slug: candidate }).select("_id").lean();
    if (!existing || String((existing as { _id: unknown })._id) === excludeId) {
      return candidate;
    }
    candidate = `${base}-${++n}`;
  }
}
