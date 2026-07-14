import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * A browsable digital-product category (e.g. "Ready-made House Plans").
 * Categories with `showPlansCatalog: true` render the existing Plan catalog
 * inline on their detail page — lets the admin re-point which category (if
 * any) surfaces the ready-made plans without a code change.
 */
const DigitalProductCategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    showPlansCatalog: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type DigitalProductCategoryDoc = InferSchemaType<typeof DigitalProductCategorySchema>;
export const DigitalProductCategory = model("DigitalProductCategory", DigitalProductCategorySchema);
