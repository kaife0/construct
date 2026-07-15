import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * A single listed item within a DigitalProductCategory (e.g. a CAD block, a
 * 3D model, a template) — for categories that aren't the specialised
 * Ready-made Plans catalog (that one keeps using the `Plan` model, which has
 * house-specific fields like beds/baths that don't generalise here).
 */
const DigitalProductSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "DigitalProductCategory", required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type DigitalProductDoc = InferSchemaType<typeof DigitalProductSchema>;
export const DigitalProduct = model("DigitalProduct", DigitalProductSchema);
