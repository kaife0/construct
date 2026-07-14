"use client";

import { listBlogPosts, deleteBlogPost, type BlogPostRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function BlogPostsList() {
  return (
    <AdminResourceList<BlogPostRecord>
      title="Blog"
      newHref="/admin/blog/new"
      newLabel="New post"
      emptyLabel="No posts yet. Create your first one."
      list={listBlogPosts}
      remove={deleteBlogPost}
      editHref={(p) => `/admin/blog/${p._id}/edit`}
      getId={(p) => p._id}
      getImage={(p) => p.image}
      getTitle={(p) => p.title}
      renderSubtitle={(p) => (p.published ? "Published" : "Draft")}
      headerLink={{ href: "/admin/blog-categories", label: "Manage categories" }}
    />
  );
}
