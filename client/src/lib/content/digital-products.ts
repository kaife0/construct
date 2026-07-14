/**
 * Digital Products category type. Data lives in MongoDB (served by ../server)
 * and is fetched via `getDigitalProductCategories()` / `getDigitalProductCategoryBySlug()`
 * in `@/lib/api`; edited from the admin panel.
 *
 * Each category opens its own page at /digital-products/[slug]. A category
 * with `showPlansCatalog: true` renders the existing ready-made Plans catalog
 * inline on that page — for now only "Ready-made House Plans" does.
 */
export type DigitalProductCategory = {
  slug: string;
  index: string; // display number ("01"…), derived from order at fetch time
  title: string;
  summary: string;
  description: string;
  image: string;
  showPlansCatalog: boolean;
};
