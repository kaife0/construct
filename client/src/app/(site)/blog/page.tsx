import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BlogGrid } from "@/components/blog/blog-grid";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Ideas, guides and site notes on planning, estimation and structural design.",
};

export default function BlogPage() {
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
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
