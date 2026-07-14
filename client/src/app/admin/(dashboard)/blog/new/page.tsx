import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata: Metadata = { title: "New Post" };

export default function NewBlogPostPage() {
  return <BlogPostForm />;
}
