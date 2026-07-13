/**
 * Service type. The data now lives in MongoDB (served by ../server) and is
 * fetched via `getServices()` in `@/lib/api`; it's edited from the admin panel.
 * The original placeholder data was migrated with the server's seed:services script.
 */
export type Service = {
  slug: string;
  index: string; // display number ("01"…), derived from order at fetch time
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  image: string;
};
