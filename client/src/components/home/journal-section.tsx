import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogGrid } from "@/components/blog/blog-grid";
import { getPosts } from "@/lib/api";

export async function JournalSection() {
  const posts = await getPosts();
  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">(06) — Journal</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">Ideas worth building on.</h2>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
            Read the blog
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10">
          {posts.length > 0 && <BlogGrid posts={posts.slice(0, 3)} lgCols={3} />}
        </div>
      </div>
    </section>
  );
}
