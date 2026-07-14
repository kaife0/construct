/**
 * Loads the 9 consolidated service categories (derived from the client's
 * handwritten service list — overlapping items like Estimation/Quantity
 * Surveying merged, Tools/Blogs/Consultation dropped since they're already
 * separate site features) into MongoDB. Idempotent: upserts by slug.
 *
 * Also removes the earlier 6-category demo set (by their old slugs) so this
 * script can be safely re-run without leaving superseded services behind.
 *
 * Usage:  npm run seed:services
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../db.js";
import { Service } from "../models/index.js";

const OLD_DEMO_SLUGS = [
  "house-planning",
  "structural-design",
  "interior-design",
  "2d-3d-plans",
  "estimation-costing",
  "site-supervision",
];

const services = [
  {
    slug: "floor-plans",
    title: "Floor Plans",
    summary: "Residential, commercial and shop floor plans — Vastu-friendly and built for your plot.",
    description:
      "From a first sketch to a fully dimensioned floor plan — we design layouts for homes, shops and commercial spaces that make the most of your plot, respect Vastu where it matters, and are ready for municipal submission.",
    deliverables: [
      "Residential planning",
      "Commercial planning",
      "Shop planning",
      "1, 2 & 3 BHK house plans",
      "Vastu-based planning",
      "Rental unit planning",
      "Modern house planning",
      "Luxury villa planning",
      "Apartment planning",
      "Corner-plot planning",
    ],
    image: "https://images.unsplash.com/photo-1721244654392-9c912a6eb236?w=800&q=80&auto=format&fit=crop",
    order: 0,
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    summary: "Full interior design for homes, offices, shops and restaurants — space to finish.",
    description:
      "Functional, beautiful interiors detailed room by room — from furniture layouts and false ceilings to lighting plans and finish schedules, for homes as well as commercial spaces like offices, cafes and salons.",
    deliverables: [
      "Living room design",
      "Kitchen design",
      "Bedroom design",
      "Wardrobe design",
      "False ceiling design",
      "Lighting plan",
      "Furniture layout plan",
      "TV unit design",
      "Dining area design",
      "Bathroom design",
      "Office / commercial interior",
      "Restaurant interior",
      "Shop interior",
      "Cafe interior",
      "Salon interior",
    ],
    image: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?w=800&q=80&auto=format&fit=crop",
    order: 1,
  },
  {
    slug: "exterior-elevation",
    title: "Exterior Elevation",
    summary: "Modern, classic or front elevations — plus the landscape around them.",
    description:
      "Your building's first impression. We design elevations that suit your taste and budget, along with the boundary walls, gates, gardens and parking that complete the exterior.",
    deliverables: [
      "Modern elevation",
      "Classic elevation",
      "Front elevation",
      "Boundary wall design",
      "Gate design",
      "Landscape design",
      "Garden design",
      "Parking design",
      "Terrace design",
      "Balcony / compound design",
    ],
    image: "https://images.unsplash.com/photo-1763819833135-d8e273798277?w=800&q=80&auto=format&fit=crop",
    order: 2,
  },
  {
    slug: "3d-walkthrough",
    title: "3D Walkthrough",
    summary: "Photoreal 3D walkthroughs — see the space before it's built.",
    description:
      "Interactive, photorealistic walkthroughs of houses, villas, apartments and commercial buildings — so you (and your client) can experience the finished space long before construction starts.",
    deliverables: [
      "House walkthrough",
      "Villa walkthrough",
      "Apartment walkthrough",
      "Commercial building walkthrough",
      "Interior walkthrough",
    ],
    image: "https://images.unsplash.com/photo-1563183193-ceaa9ee013e8?w=800&q=80&auto=format&fit=crop",
    order: 3,
  },
  {
    slug: "bar-bending-schedule-bbs",
    title: "Bar Bending Schedule (BBS)",
    summary: "Accurate BBS and steel quantity calculations for every structural member.",
    description:
      "Detailed bar-bending schedules for beams, columns, slabs, footings and staircases — with precise steel weight calculations your contractor can order and build from directly.",
    deliverables: [
      "Beam BBS",
      "Column BBS",
      "Slab BBS",
      "Footing BBS",
      "Staircase BBS",
      "Complete house BBS",
      "Steel weight calculation",
    ],
    image: "https://images.unsplash.com/photo-1530863506128-dc9eb5c3e0fc?w=800&q=80&auto=format&fit=crop",
    order: 4,
  },
  {
    slug: "estimation-quantity-surveying",
    title: "Estimation & Quantity Surveying",
    summary: "Transparent BOQs, rate analysis and quantity take-offs for realistic budgets.",
    description:
      "Know your costs before you build. We prepare detailed material estimates, bills of quantities and take-offs — including tender-ready BOQs — so there are no surprises mid-construction.",
    deliverables: [
      "Material estimation",
      "Complete BOQ preparation",
      "Rate analysis",
      "Quantity take-off",
      "Tender BOQ",
      "Measurement sheet",
    ],
    image: "https://images.unsplash.com/photo-1711437757489-f739a581c55b?w=800&q=80&auto=format&fit=crop",
    order: 5,
  },
  {
    slug: "approval-drawings",
    title: "Approval Drawings",
    summary: "Submission-ready drawings for municipal / authority approval.",
    description:
      "Drawings prepared to your local authority's submission standards, so your building plan approval moves without avoidable back-and-forth.",
    deliverables: ["Submission drawings", "Building approval drawings"],
    image: "https://images.unsplash.com/photo-1674204712645-0ccdd9dd1645?w=800&q=80&auto=format&fit=crop",
    order: 6,
  },
  {
    slug: "renovation-services",
    title: "Renovation Services",
    summary: "House, kitchen, bathroom and shop renovation — planned and drawn properly.",
    description:
      "Whether it's a full house renovation or a single room remodel, we plan and draw the changes properly first — so the contractor executes exactly what you intended.",
    deliverables: [
      "House renovation",
      "Interior remodeling",
      "Kitchen remodeling",
      "Bathroom remodeling",
      "Shop renovation",
    ],
    image: "https://images.unsplash.com/photo-1760963301666-582b92218a19?w=800&q=80&auto=format&fit=crop",
    order: 7,
  },
  {
    slug: "freelance-drafting-support",
    title: "Freelance Drafting Support",
    summary: "On-demand CAD drafting and drawing support for architects, engineers and builders.",
    description:
      "Need extra drafting hands? We take on drawing modifications, construction documentation and general CAD drafting work as freelance support for your team or project.",
    deliverables: ["Drawing modification", "Construction documentation", "CAD drafting"],
    image: "https://images.unsplash.com/photo-1618385455730-2571c38966b7?w=800&q=80&auto=format&fit=crop",
    order: 8,
  },
];

async function main() {
  await connectDB();

  const { deletedCount } = await Service.deleteMany({ slug: { $in: OLD_DEMO_SLUGS } });
  if (deletedCount) console.log(`[seed:services] removed ${deletedCount} superseded demo service(s)`);

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
