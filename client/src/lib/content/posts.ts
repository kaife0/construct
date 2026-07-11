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
};

export const posts: Post[] = [
  {
    slug: "how-many-bricks",
    title: "How many bricks does your wall really need?",
    excerpt: "A quick, practical way to estimate brick quantity — and the wastage most people forget to add.",
    category: "Estimation",
    date: "2026-05-18",
    readMins: 4,
  },
  {
    slug: "m20-vs-m25-concrete",
    title: "M20 vs M25: which concrete grade for your home?",
    excerpt: "What the numbers mean, where each grade belongs, and how the choice affects cost.",
    category: "Structural",
    date: "2026-04-02",
    readMins: 6,
  },
  {
    slug: "vastu-and-planning",
    title: "Balancing Vastu with good floor planning",
    excerpt: "How to respect Vastu preferences without compromising light, flow and efficiency.",
    category: "Planning",
    date: "2026-02-27",
    readMins: 5,
  },
];
