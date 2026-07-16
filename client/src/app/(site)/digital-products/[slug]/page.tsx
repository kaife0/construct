import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDigitalProductCategories, getDigitalProductCategoryBySlug, getPlans, getDigitalProducts } from "@/lib/api";
import { PlansGrid } from "@/components/plans-grid";
import { ProductGrid } from "@/components/digital-products/product-grid";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getDigitalProductCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getDigitalProductCategoryBySlug(slug);
  if (!category) return { title: "Digital Products" };
  return buildMetadata({
    title: category.title,
    description: category.summary,
    path: `/digital-products/${slug}`,
    images: category.image ? [category.image] : undefined,
  });
}

export default async function DigitalProductCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getDigitalProductCategoryBySlug(slug);
  if (!category) notFound();

  const plans = category.showPlansCatalog ? await getPlans() : [];
  const products = category.showPlansCatalog ? [] : await getDigitalProducts(slug);

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Digital Products", path: "/digital-products" },
          { name: category.title, path: `/digital-products/${slug}` },
        ])}
      />
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href="/digital-products" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> Digital Products
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            Category {category.index}
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{category.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">{category.summary}</p>
        </div>
      </header>

      <div className="container-x py-10 md:py-14">
        <p className="max-w-2xl text-base leading-relaxed text-graphite">{category.description}</p>

        <div className="mt-10">
          {category.showPlansCatalog ? (
            plans.length > 0 ? (
              <PlansGrid plans={plans} lgCols={3} />
            ) : (
              <p className="text-sm text-graphite">Plans are being added — check back soon.</p>
            )
          ) : products.length > 0 ? (
            <ProductGrid products={products} categorySlug={slug} />
          ) : (
            <p className="text-sm text-graphite">Products are being added — check back soon.</p>
          )}
        </div>
      </div>
    </article>
  );
}
