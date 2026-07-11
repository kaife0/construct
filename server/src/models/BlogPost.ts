import { Schema, model, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" }, // rich text / markdown, authored in admin
    category: { type: String, required: true },
    readMins: { type: Number, default: 4 },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;
export const BlogPost = model("BlogPost", BlogPostSchema);
