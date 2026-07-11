/**
 * Placeholder project-showcase content for the About page — completed work
 * and work currently in progress. Maps to a future `Project` model served
 * from /server (MongoDB), managed from the admin panel (with status toggle).
 */

export type Project = {
  slug: string;
  title: string;
  location: string;
  status: "completed" | "in-progress";
  year: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "riverside-residence",
    title: "Riverside Residence",
    location: "Pune, MH",
    status: "completed",
    year: "2025",
    image: "https://images.unsplash.com/photo-1615461476249-718ef8bc369c?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "maple-court-villa",
    title: "Maple Court Villa",
    location: "Nashik, MH",
    status: "completed",
    year: "2024",
    image: "https://images.unsplash.com/photo-1777115470242-9b21d2c67729?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "sunrise-apartments",
    title: "Sunrise Apartments",
    location: "Nagpur, MH",
    status: "in-progress",
    year: "2026",
    image: "https://images.unsplash.com/photo-1720278516199-55256b5040ef?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "greenfield-bungalow",
    title: "Greenfield Bungalow",
    location: "Aurangabad, MH",
    status: "in-progress",
    year: "2026",
    image: "https://images.unsplash.com/photo-1673978483073-f6e8e5b086c1?w=800&q=80&auto=format&fit=crop",
  },
];
