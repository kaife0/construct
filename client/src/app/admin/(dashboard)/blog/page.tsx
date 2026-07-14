import type { Metadata } from "next";
import { BlogPostsList } from "@/components/admin/blog-posts-list";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return <BlogPostsList />;
}
