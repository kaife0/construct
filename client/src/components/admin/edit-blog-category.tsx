"use client";

import { getBlogCategory, type BlogCategoryRecord } from "@/lib/admin-api";
import { BlogCategoryForm } from "@/components/admin/blog-category-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditBlogCategory({ id }: { id: string }) {
  const { data, error } = useResource<BlogCategoryRecord>(id, getBlogCategory, "Could not load category.");
  return (
    <ResourceLoader data={data} error={error}>
      {(category) => <BlogCategoryForm existing={category} />}
    </ResourceLoader>
  );
}
