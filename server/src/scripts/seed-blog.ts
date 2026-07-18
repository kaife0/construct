/**
 * Loads the original placeholder blog categories + posts into MongoDB.
 * Idempotent: upserts categories/posts by slug.
 *
 * Usage:  npm run seed:blog
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import { BlogCategory, BlogPost } from "../models/index.js";

const categories = [
  { slug: "estimation", title: "Estimation", order: 0 },
  { slug: "structural", title: "Structural", order: 1 },
  { slug: "planning", title: "Planning", order: 2 },
];

const posts = [
  {
    slug: "how-many-bricks",
    title: "How many bricks does your wall really need?",
    excerpt: "A quick, practical way to estimate brick quantity — and the wastage most people forget to add.",
    content:
      "<p>Estimating bricks accurately starts with the net wall area — length times height, minus doors and windows.</p>" +
      "<p>For a standard 9\" wall using modular bricks (190×90×90mm with a 10mm mortar joint), you need roughly <strong>8 bricks per square foot</strong>. Always add 5-8% wastage for cuts and breakage.</p>" +
      "<p>Use the <a href=\"/calculators\">brick calculator</a> for an exact number based on your wall dimensions.</p>",
    categorySlug: "estimation",
    readMins: 4,
    image: "https://images.unsplash.com/photo-1704005446360-5f30e4276182?w=800&q=80&auto=format&fit=crop",
    published: true,
    order: 0,
  },
  {
    slug: "m20-vs-m25-concrete",
    title: "M20 vs M25: which concrete grade for your home?",
    excerpt: "What the numbers mean, where each grade belongs, and how the choice affects cost.",
    content:
      "<p>The number after \"M\" is the characteristic compressive strength in N/mm² at 28 days.</p>" +
      "<p><strong>M20</strong> (1:1.5:3 nominal mix) is the standard choice for residential slabs, beams and columns in low-rise construction. <strong>M25</strong> (1:1:2) is stronger and typically used where loads are higher — multi-storey buildings, or if your structural engineer's design specifically calls for it.</p>" +
      "<p>Don't over-specify — a higher grade costs more cement per unit volume without benefit if your design doesn't need the extra strength.</p>",
    categorySlug: "structural",
    readMins: 6,
    image: "https://images.unsplash.com/photo-1685464196387-854858ce0f4f?w=800&q=80&auto=format&fit=crop",
    published: true,
    order: 1,
  },
  {
    slug: "vastu-and-planning",
    title: "Balancing Vastu with good floor planning",
    excerpt: "How to respect Vastu preferences without compromising light, flow and efficiency.",
    content:
      "<p>Vastu and good architecture aren't opposites — most Vastu principles (kitchen in the south-east, master bedroom in the south-west, main entrance facing an auspicious direction) are compatible with efficient, well-lit layouts.</p>" +
      "<p>The friction usually comes from rigid interpretation. A skilled planner works Vastu preferences into the layout from the start, rather than forcing changes onto a finished plan — that's when compromises on light and ventilation happen.</p>",
    categorySlug: "planning",
    readMins: 5,
    image: "https://images.unsplash.com/photo-1433840496881-cbd845929862?w=800&q=80&auto=format&fit=crop",
    published: true,
    order: 2,
  },
];

async function main() {
  await connectDB();

  const categoryIds = new Map<string, string>();
  for (const c of categories) {
    const doc = await BlogCategory.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    categoryIds.set(c.slug, doc.id);
  }

  for (const { categorySlug, ...p } of posts) {
    const categoryId = categoryIds.get(categorySlug);
    await BlogPost.findOneAndUpdate({ slug: p.slug }, { ...p, categoryId }, { upsert: true, new: true });
  }

  console.log(`[seed:blog] upserted ${categories.length} categories, ${posts.length} posts`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed:blog] failed:", err);
  process.exit(1);
});
