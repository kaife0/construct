/**
 * One-time migration: loads the original placeholder services into MongoDB so
 * the live site looks identical after switching to DB-backed content — but now
 * every field is editable from the admin panel.
 *
 * Idempotent: upserts by slug, so re-running won't create duplicates.
 *
 * Usage:  npm run seed:services
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import { Service } from "../models/index.js";

const services = [
  {
    slug: "house-planning",
    title: "House Planning",
    summary: "Site analysis, space planning and municipal-ready layouts.",
    description:
      "We translate your requirements, plot and budget into an efficient, Vastu-conscious layout that passes local building bylaws — optimising light, ventilation and circulation before a single brick is laid.",
    deliverables: ["Site & plot analysis", "Zoning & floor layouts", "Bylaw / setback compliance", "Area statement"],
    image: "https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800&q=80&auto=format&fit=crop",
    order: 0,
  },
  {
    slug: "structural-design",
    title: "Structural Design",
    summary: "RCC & steel design — safe, economical and IS-code compliant.",
    description:
      "Detailed structural analysis and design of foundations, columns, beams and slabs. We balance safety and cost, delivering bar-bending schedules your contractor can build from directly.",
    deliverables: ["Load & analysis calculations", "RCC / steel detailing", "Foundation design", "Bar-bending schedule"],
    image: "https://images.unsplash.com/photo-1530863506128-dc9eb5c3e0fc?w=800&q=80&auto=format&fit=crop",
    order: 1,
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    summary: "Functional, warm interiors detailed down to the finish.",
    description:
      "Space-efficient interiors with material palettes, furniture layouts and lighting plans — designed to be beautiful, buildable and within budget.",
    deliverables: ["Concept & mood boards", "Furniture layouts", "Material & finish schedule", "Lighting plan"],
    image: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=800&q=80&auto=format&fit=crop",
    order: 2,
  },
  {
    slug: "2d-3d-plans",
    title: "2D & 3D Plans",
    summary: "Working drawings and photoreal 3D visualisation.",
    description:
      "Precise 2D working drawings for construction, plus photorealistic 3D elevations and walkthroughs so you can see the finished home before you build it.",
    deliverables: ["2D working drawings", "3D elevations", "Photoreal renders", "Walkthrough (on request)"],
    image: "https://images.unsplash.com/photo-1563183193-ceaa9ee013e8?w=800&q=80&auto=format&fit=crop",
    order: 3,
  },
  {
    slug: "estimation-costing",
    title: "Estimation & Costing",
    summary: "Transparent BOQs and realistic project budgets.",
    description:
      "Detailed quantity take-offs and bills of quantities so you know material and labour costs upfront — no surprises mid-construction.",
    deliverables: ["Quantity take-off", "Bill of quantities (BOQ)", "Rate analysis", "Budget forecast"],
    image: "https://images.unsplash.com/photo-1711437757489-f739a581c55b?w=800&q=80&auto=format&fit=crop",
    order: 4,
  },
  {
    slug: "site-supervision",
    title: "Site Supervision",
    summary: "Quality checks and progress oversight on site.",
    description:
      "Periodic site visits and quality audits to ensure work matches the drawings and specifications — keeping your project on schedule and to standard.",
    deliverables: ["Stage-wise inspection", "Quality & material audit", "Progress reporting", "Contractor coordination"],
    image: "https://images.unsplash.com/photo-1760963301666-582b92218a19?w=800&q=80&auto=format&fit=crop",
    order: 5,
  },
];

async function main() {
  await connectDB();
  for (const s of services) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
  }
  console.log(`[seed:services] upserted ${services.length} services`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed:services] failed:", err);
  process.exit(1);
});
