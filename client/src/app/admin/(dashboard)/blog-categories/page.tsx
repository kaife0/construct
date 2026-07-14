import type { Metadata } from "next";
import { BlogCategoriesList } from "@/components/admin/blog-categories-list";

export const metadata: Metadata = { title: "Blog Categories" };

export default function AdminBlogCategoriesPage() {
  return <BlogCategoriesList />;
}
