"use client";

import { listBlogCategories, deleteBlogCategory, type BlogCategoryRecord } from "@/lib/admin-api";
import { AdminResourceList } from "@/components/admin/admin-resource-list";

export function BlogCategoriesList() {
  return (
    <AdminResourceList<BlogCategoryRecord>
      title="Blog Categories"
      newHref="/admin/blog-categories/new"
      newLabel="New category"
      emptyLabel="No categories yet. Create your first one."
      list={listBlogCategories}
      remove={deleteBlogCategory}
      editHref={(c) => `/admin/blog-categories/${c._id}/edit`}
      getId={(c) => c._id}
      getImage={() => undefined}
      getTitle={(c) => c.title}
      renderSubtitle={(c) => c.slug}
      backHref="/admin/blog"
      backLabel="Blog"
    />
  );
}
