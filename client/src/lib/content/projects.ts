/**
 * Project-showcase content for the About page — completed work and work
 * currently in progress. Served from the `Project` model (MongoDB) via
 * `getProjects()` in `@/lib/api`, managed from the admin panel.
 */

export type Project = {
  slug: string;
  title: string;
  location: string;
  status: "completed" | "in-progress";
  year: string;
  image: string;
  description?: string;
  area?: number;
  floors?: number;
  type?: string;
  budget?: number;
};
