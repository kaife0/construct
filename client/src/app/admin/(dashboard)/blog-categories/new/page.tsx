import type { Metadata } from "next";
import { BlogCategoryForm } from "@/components/admin/blog-category-form";

export const metadata: Metadata = { title: "New Blog Category" };

export default function NewBlogCategoryPage() {
  return <BlogCategoryForm />;
}
