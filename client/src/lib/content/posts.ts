/**
 * Blog post type. Data lives in MongoDB (served by ../server) and is fetched
 * via `getPosts()` / `getPostBySlug()` in `@/lib/api`; edited from the admin
 * panel. `content` is admin-authored Markdown, rendered on the post page.
 */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string; // ISO, from createdAt
  readMins: number;
  image: string;
};

/** A blog category — a simple taxonomy, admin-managed. */
export type BlogCategory = {
  slug: string;
  title: string;
};
