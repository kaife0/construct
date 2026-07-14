import { Schema, model, type InferSchemaType } from "mongoose";

/** A simple taxonomy for blog posts — e.g. "Estimation", "Structural", "Planning". */
const BlogCategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type BlogCategoryDoc = InferSchemaType<typeof BlogCategorySchema>;
export const BlogCategory = model("BlogCategory", BlogCategorySchema);
