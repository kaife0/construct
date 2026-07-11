/**
 * Placeholder journal content. Maps 1:1 to the future `BlogPost` model served
 * from /server (MongoDB) and managed from the admin panel.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readMins: number;
  /** Placeholder photo — replace with the client's real cover image. */
  image: string;
};

export const posts: Post[] = [
  {
    slug: "how-many-bricks",
    title: "How many bricks does your wall really need?",
    excerpt: "A quick, practical way to estimate brick quantity — and the wastage most people forget to add.",
    category: "Estimation",
    date: "2026-05-18",
    readMins: 4,
    image: "https://images.unsplash.com/photo-1704005446360-5f30e4276182?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "m20-vs-m25-concrete",
    title: "M20 vs M25: which concrete grade for your home?",
    excerpt: "What the numbers mean, where each grade belongs, and how the choice affects cost.",
    category: "Structural",
    date: "2026-04-02",
    readMins: 6,
    image: "https://images.unsplash.com/photo-1685464196387-854858ce0f4f?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "vastu-and-planning",
    title: "Balancing Vastu with good floor planning",
    excerpt: "How to respect Vastu preferences without compromising light, flow and efficiency.",
    category: "Planning",
    date: "2026-02-27",
    readMins: 5,
    image: "https://images.unsplash.com/photo-1433840496881-cbd845929862?w=800&q=80&auto=format&fit=crop",
  },
];
