"use client";

import { getBlogPost, type BlogPostRecord } from "@/lib/admin-api";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

export function EditBlogPost({ id }: { id: string }) {
  const { data, error } = useResource<BlogPostRecord>(id, getBlogPost, "Could not load post.");
  return (
    <ResourceLoader data={data} error={error}>
      {(post) => <BlogPostForm existing={post} />}
    </ResourceLoader>
  );
}
