import { Reveal } from "@/components/reveal";
import { BlogCard } from "@/components/blog/blog-card";
import type { Post } from "@/lib/content";

export function BlogGrid({ posts, lgCols = 3 }: { posts: Post[]; lgCols?: 3 | 4 }) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${lgCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {posts.map((post, i) => (
        <Reveal key={post.slug} delay={(i % lgCols) * 0.05}>
          <BlogCard post={post} />
        </Reveal>
      ))}
    </div>
  );
}
