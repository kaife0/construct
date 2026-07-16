import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { CategoryPills } from "@/components/blog/category-pills";
import { getPosts, getBlogCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Journal — House Planning, Estimation & Structural Design Guides",
  description:
    "Practical, jargon-free guides on house planning, material estimation, costing and structural design — written from real projects by a practising civil engineer.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getBlogCategories()]);

  return (
    <>
      <PageHeader
        index="06"
        label="Journal"
        title="Ideas worth building on."
        lede="Practical, jargon-free guides on planning, estimation and structural design — from real projects."
      />

      <section>
        <div className="container-x py-10 md:py-14">
          <CategoryPills categories={categories} />
          <div className="mt-8">
            {posts.length > 0 ? (
              <BlogGrid posts={posts} />
            ) : (
              <p className="text-sm text-graphite">Posts are being added — check back soon.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
