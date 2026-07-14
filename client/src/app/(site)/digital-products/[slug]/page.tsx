import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDigitalProductCategories, getDigitalProductCategoryBySlug, getPlans } from "@/lib/api";
import { PlansGrid } from "@/components/plans-grid";

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
  return { title: category?.title ?? "Digital Products", description: category?.summary };
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

  return (
    <article>
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
        <div className="relative aspect-[21/9] w-full overflow-hidden border border-line">
          <Image
            src={category.image}
            alt={category.title}
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite">{category.description}</p>

        {category.showPlansCatalog && (
          <div className="mt-12">
            <span className="label text-[10px]">BROWSE PLANS</span>
            <div className="mt-6">
              {plans.length > 0 ? (
                <PlansGrid plans={plans} lgCols={3} />
              ) : (
                <p className="text-sm text-graphite">Plans are being added — check back soon.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
