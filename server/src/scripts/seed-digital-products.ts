/**
 * Seeds the Digital Products catalog. For now this is a single category —
 * "Ready-made House Plans" — whose detail page renders the existing Plan
 * catalog inline (showPlansCatalog: true). More categories (CAD blocks, 3D
 * models, templates, etc.) can be added later from the admin panel without
 * any code changes.
 *
 * Usage:  npm run seed:digital-products
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import { DigitalProductCategory } from "../models/index.js";

const categories = [
  {
    slug: "ready-made-house-plans",
    title: "Ready-made House Plans",
    summary: "Proven floor plans you can buy and customise — no design wait.",
    description:
      "A growing catalogue of ready-made house plans — pick one close to what you need, and we'll customise it for your plot, budget and Vastu preferences. Faster and more affordable than starting from scratch.",
    image: "https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800&q=80&auto=format&fit=crop",
    showPlansCatalog: true,
    order: 0,
  },
];

async function main() {
  await connectDB();
  for (const c of categories) {
    await DigitalProductCategory.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
  }
  console.log(`[seed:digital-products] upserted ${categories.length} categor${categories.length === 1 ? "y" : "ies"}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed:digital-products] failed:", err);
  process.exit(1);
});
