import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { CategoryPills } from "@/components/blog/category-pills";
import { getPosts, getBlogCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getBlogCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Journal" };
  return buildMetadata({
    title: `${category.title} — Journal`,
    description: `${category.title} guides and articles on house planning, estimation and structural design.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getBlogCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const posts = await getPosts(slug);

  return (
    <>
      <PageHeader
        index="06"
        label="Journal"
        title={category.title}
        lede={`Posts filed under ${category.title}.`}
      />

      <section>
        <div className="container-x py-10 md:py-14">
          <CategoryPills categories={categories} activeSlug={slug} />
          <div className="mt-8">
            {posts.length > 0 ? (
              <BlogGrid posts={posts} />
            ) : (
              <p className="text-sm text-graphite">No posts in this category yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
