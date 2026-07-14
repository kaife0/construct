import { Schema, model, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" }, // markdown, authored in admin, rendered on the public post page
    categoryId: { type: Schema.Types.ObjectId, ref: "BlogCategory", required: true, index: true },
    image: { type: String, required: true },
    readMins: { type: Number, default: 4 },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;
export const BlogPost = model("BlogPost", BlogPostSchema);
