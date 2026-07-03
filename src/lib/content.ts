/**
 * Placeholder site content. In Phase 5/6 this moves into MongoDB and becomes
 * editable from the admin panel. Kept in one file so swapping to real client
 * content (and later a DB fetch) is a single, contained change.
 */

export type Service = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  /** Placeholder photo — replace with the client's real project image. */
  image: string;
};

export const services: Service[] = [
  {
    slug: "house-planning",
    index: "01",
    title: "House Planning",
    summary: "Site analysis, space planning and municipal-ready layouts.",
    description:
      "We translate your requirements, plot and budget into an efficient, Vastu-conscious layout that passes local building bylaws — optimising light, ventilation and circulation before a single brick is laid.",
    deliverables: ["Site & plot analysis", "Zoning & floor layouts", "Bylaw / setback compliance", "Area statement"],
    image: "https://picsum.photos/seed/house-planning/640/480",
  },
  {
    slug: "structural-design",
    index: "02",
    title: "Structural Design",
    summary: "RCC & steel design — safe, economical and IS-code compliant.",
    description:
      "Detailed structural analysis and design of foundations, columns, beams and slabs. We balance safety and cost, delivering bar-bending schedules your contractor can build from directly.",
    deliverables: ["Load & analysis calculations", "RCC / steel detailing", "Foundation design", "Bar-bending schedule"],
  },
  {
    slug: "interior-design",
    index: "03",
    title: "Interior Design",
    summary: "Functional, warm interiors detailed down to the finish.",
    description:
      "Space-efficient interiors with material palettes, furniture layouts and lighting plans — designed to be beautiful, buildable and within budget.",
    deliverables: ["Concept & mood boards", "Furniture layouts", "Material & finish schedule", "Lighting plan"],
  },
  {
    slug: "2d-3d-plans",
    index: "04",
    title: "2D & 3D Plans",
    summary: "Working drawings and photoreal 3D visualisation.",
    description:
      "Precise 2D working drawings for construction, plus photorealistic 3D elevations and walkthroughs so you can see the finished home before you build it.",
    deliverables: ["2D working drawings", "3D elevations", "Photoreal renders", "Walkthrough (on request)"],
  },
  {
    slug: "estimation-costing",
    index: "05",
    title: "Estimation & Costing",
    summary: "Transparent BOQs and realistic project budgets.",
    description:
      "Detailed quantity take-offs and bills of quantities so you know material and labour costs upfront — no surprises mid-construction.",
    deliverables: ["Quantity take-off", "Bill of quantities (BOQ)", "Rate analysis", "Budget forecast"],
  },
  {
    slug: "site-supervision",
    index: "06",
    title: "Site Supervision",
    summary: "Quality checks and progress oversight on site.",
    description:
      "Periodic site visits and quality audits to ensure work matches the drawings and specifications — keeping your project on schedule and to standard.",
    deliverables: ["Stage-wise inspection", "Quality & material audit", "Progress reporting", "Contractor coordination"],
  },
];

export const process = [
  { step: "01", title: "Consult", desc: "We discuss your plot, needs and budget over a call or WhatsApp." },
  { step: "02", title: "Design", desc: "Layouts, structure and 3D views — refined until you're happy." },
  { step: "03", title: "Detail", desc: "Working drawings, structural details and estimates for construction." },
  { step: "04", title: "Support", desc: "On-call guidance and optional site supervision through the build." },
];

export const profile = {
  // Placeholder — replace with the client's real details (admin-editable in Phase 6).
  name: "Er. A. Sharma",
  role: "Civil Engineer & Structural Consultant",
  intro:
    "Fourteen years of turning plots into homes and ideas into buildable, code-compliant structures across residential and commercial projects.",
  bio: [
    "I'm a practising civil engineer specialising in structural design and end-to-end home planning. My work spans everything from a first floor-plan sketch to the bar-bending schedule your contractor builds from.",
    "I believe good engineering is invisible — it just works, lasts, and stays within budget. Every project gets the same discipline: careful analysis, honest costing, and drawings clear enough to build without guesswork.",
  ],
  credentials: [
    "B.E. Civil Engineering",
    "Chartered Engineer (India)",
    "Licensed Structural Engineer",
    "STAAD.Pro / AutoCAD / Revit",
  ],
};

export const achievements = [
  { year: "2024", title: "500th project delivered", desc: "Crossed 500 completed residential & commercial projects." },
  { year: "2021", title: "Commercial complex, RCC design", desc: "Lead structural consultant for a 6-storey mixed-use build." },
  { year: "2018", title: "Featured — regional builders' expo", desc: "Invited speaker on cost-efficient RCC design." },
  { year: "2010", title: "Practice established", desc: "Started independent consulting practice." },
];

export type Plan = {
  slug: string;
  index: string;
  title: string;
  config: string; // e.g. "3 BHK · G+1"
  area: number; // sq.ft built-up
  beds: number;
  baths: number;
  floors: number;
  facing: string;
  tag?: string;
};

export const plans: Plan[] = [
  { slug: "modern-3bhk-30x40", index: "01", title: "Modern 3 BHK Villa", config: "3 BHK · G+1", area: 1850, beds: 3, baths: 3, floors: 2, facing: "East", tag: "Popular" },
  { slug: "compact-2bhk-20x30", index: "02", title: "Compact 2 BHK Home", config: "2 BHK · G+0", area: 980, beds: 2, baths: 2, floors: 1, facing: "North" },
  { slug: "duplex-4bhk-40x60", index: "03", title: "Premium Duplex", config: "4 BHK · G+2", area: 3200, beds: 4, baths: 4, floors: 3, facing: "West", tag: "New" },
  { slug: "row-house-25x50", index: "04", title: "Row House Plan", config: "3 BHK · G+1", area: 1600, beds: 3, baths: 2, floors: 2, facing: "South" },
];

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
