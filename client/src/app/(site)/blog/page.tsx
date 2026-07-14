import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { CategoryPills } from "@/components/blog/category-pills";
import { getPosts, getBlogCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Journal",
  description: "Ideas, guides and site notes on planning, estimation and structural design.",
};

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
