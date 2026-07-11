/**
 * Placeholder ready-made-plan content. Maps 1:1 to the future `Plan` model
 * served from /server (MongoDB) and managed from the admin panel. This is
 * treated as a service in its own right — shown on Home and on Services.
 */

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
