import { Schema, model, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" }, // HTML from the admin editor (legacy posts hold markdown)
    categoryId: { type: Schema.Types.ObjectId, ref: "BlogCategory", required: true, index: true },
    image: { type: String, required: true },
    readMins: { type: Number, default: 4 },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    // Per-post SEO — every field falls back to its content counterpart when blank.
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    focusKeyword: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    noindex: { type: Boolean, default: false },
    nofollow: { type: Boolean, default: false },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    faqs: {
      type: [{ _id: false, question: { type: String, required: true }, answer: { type: String, required: true } }],
      default: [],
    },
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;
export const BlogPost = model("BlogPost", BlogPostSchema);
