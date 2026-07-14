import Link from "next/link";
import type { BlogCategory } from "@/lib/content";

/** Category filter pills shown above the blog grid — links to /blog or /blog/category/[slug]. */
export function CategoryPills({ categories, activeSlug }: { categories: BlogCategory[]; activeSlug?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`label border px-3 py-1.5 text-[10px] transition-colors ${
          !activeSlug ? "border-ink bg-ink text-paper" : "border-line text-graphite hover:border-ink hover:text-ink"
        }`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/blog/category/${c.slug}`}
          className={`label border px-3 py-1.5 text-[10px] transition-colors ${
            activeSlug === c.slug ? "border-ink bg-ink text-paper" : "border-line text-graphite hover:border-ink hover:text-ink"
          }`}
        >
          {c.title}
        </Link>
      ))}
    </div>
  );
}
