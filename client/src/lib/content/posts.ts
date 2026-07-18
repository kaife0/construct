/**
 * Blog post type. Data lives in MongoDB (served by ../server) and is fetched
 * via `getPosts()` / `getPostBySlug()` in `@/lib/api`; edited from the admin
 * panel. `content` is admin-authored HTML, rendered on the post page.
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
  seo: PostSeo;
};

/** Per-post SEO overrides, authored in the admin panel. Blank fields fall back to the post itself. */
export type PostSeo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  noindex: boolean;
  nofollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: { question: string; answer: string }[];
};

/** A blog category — a simple taxonomy, admin-managed. */
export type BlogCategory = {
  slug: string;
  title: string;
};
