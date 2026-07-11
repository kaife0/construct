/**
 * Placeholder ready-made-plan content. Maps 1:1 to the future `Plan` model
 * served from /server (MongoDB) and managed from the admin panel. This is
 * treated as a service in its own right — shown on Home and on Services,
 * each opening its own detail page at /plans/[slug].
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
  /** Placeholder photo — replace with the client's real render/photo. */
  image: string;
  description: string;
};

export const plans: Plan[] = [
  {
    slug: "modern-3bhk-30x40",
    index: "01",
    title: "Modern 3 BHK Villa",
    config: "3 BHK · G+1",
    area: 1850,
    beds: 3,
    baths: 3,
    floors: 2,
    facing: "East",
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1769780265587-037ee842c0b0?w=1200&q=80&auto=format&fit=crop",
    description:
      "A well-balanced east-facing villa on a 30×40 plot, with an open living-dining core, three ensuite bedrooms and a private terrace on the first floor. Designed for good cross-ventilation and Vastu-friendly zoning.",
  },
  {
    slug: "compact-2bhk-20x30",
    index: "02",
    title: "Compact 2 BHK Home",
    config: "2 BHK · G+0",
    area: 980,
    beds: 2,
    baths: 2,
    floors: 1,
    facing: "North",
    image: "https://images.unsplash.com/photo-1622396481322-3b83d186701b?w=1200&q=80&auto=format&fit=crop",
    description:
      "An efficient single-storey layout for a 20×30 plot — ideal for a starter home or rental unit. No space wasted on long corridors; every room gets direct natural light.",
  },
  {
    slug: "duplex-4bhk-40x60",
    index: "03",
    title: "Premium Duplex",
    config: "4 BHK · G+2",
    area: 3200,
    beds: 4,
    baths: 4,
    floors: 3,
    facing: "West",
    tag: "New",
    image: "https://images.unsplash.com/photo-1686385798052-0e86d41b4a60?w=1200&q=80&auto=format&fit=crop",
    description:
      "A spacious three-level duplex for larger families — a formal living area on the ground floor, private bedroom wing above, and a rooftop entertainment deck on the second floor.",
  },
  {
    slug: "row-house-25x50",
    index: "04",
    title: "Row House Plan",
    config: "3 BHK · G+1",
    area: 1600,
    beds: 3,
    baths: 2,
    floors: 2,
    facing: "South",
    image: "https://images.unsplash.com/photo-1576375801517-45814f908aa4?w=1200&q=80&auto=format&fit=crop",
    description:
      "A compact, party-wall-friendly design for a 25×50 row plot — common in gated layouts. Keeps the front elevation street-friendly while maximising usable floor area.",
  },
];
