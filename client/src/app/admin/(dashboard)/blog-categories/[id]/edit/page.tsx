import type { Metadata } from "next";
import { EditBlogCategory } from "@/components/admin/edit-blog-category";

export const metadata: Metadata = { title: "Edit Blog Category" };

export default async function EditBlogCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditBlogCategory id={id} />;
}
