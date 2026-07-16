import { CardGrid } from "@/components/card-grid";
import { BlogCard } from "@/components/blog/blog-card";
import type { Post } from "@/lib/content";

export function BlogGrid({ posts, lgCols = 3 }: { posts: Post[]; lgCols?: 3 | 4 }) {
  return <CardGrid items={posts} lgCols={lgCols} getKey={(p) => p.slug} renderItem={(p) => <BlogCard post={p} />} />;
}
