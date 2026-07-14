import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CategoryGrid } from "@/components/digital-products/category-grid";
import { getDigitalProductCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Digital Products",
  description: "Ready-made house plans, templates and CAD resources you can buy and customise.",
};

export default async function DigitalProductsPage() {
  const categories = await getDigitalProductCategories();

  return (
    <>
      <PageHeader
        index="04"
        label="Digital Products"
        title="Buy ready-made, then make it yours."
        lede="Ready-made house plans and design resources — pick one and we'll customise it for your plot, budget and Vastu preferences."
      />

      <section>
        <div className="container-x py-10 md:py-14">
          {categories.length > 0 ? (
            <CategoryGrid categories={categories} />
          ) : (
            <p className="text-sm text-graphite">More products are on the way — check back soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
