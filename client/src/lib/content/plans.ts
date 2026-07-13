/**
 * Ready-made-plan type. The data now lives in MongoDB (served by ../server)
 * and is fetched via `getPlans()` / `getPlanBySlug()` in `@/lib/api`; it's
 * edited from the admin panel. The original placeholder data was migrated
 * with the server's seed:plans script. Treated as a service in its own
 * right — shown on Home and on Services, each opening its own detail page
 * at /plans/[slug].
 */
export type Plan = {
  slug: string;
  index: string; // display number ("01"…), derived from order at fetch time
  title: string;
  config: string; // e.g. "3 BHK · G+1"
  area: number; // sq.ft built-up
  beds: number;
  baths: number;
  floors: number;
  facing: string;
  tag?: string;
  image: string;
  description: string;
};
