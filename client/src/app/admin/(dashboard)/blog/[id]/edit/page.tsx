import type { Metadata } from "next";
import { EditBlogPost } from "@/components/admin/edit-blog-post";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditBlogPost id={id} />;
}
