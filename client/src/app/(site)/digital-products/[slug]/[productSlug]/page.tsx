import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getDigitalProductCategories, getDigitalProductCategoryBySlug, getDigitalProducts, getDigitalProductBySlug } from "@/lib/api";
import { siteConfig, whatsappUrl } from "@/lib/site";

export async function generateStaticParams() {
  const categories = await getDigitalProductCategories();
  const params = await Promise.all(
    categories.map(async (category) => {
      const products = await getDigitalProducts(category.slug);
      return products.map((product) => ({ slug: category.slug, productSlug: product.slug }));
    })
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const product = await getDigitalProductBySlug(slug, productSlug);
  return { title: product?.title ?? "Product", description: product?.description };
}

export default async function DigitalProductItemPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const category = await getDigitalProductCategoryBySlug(slug);
  if (!category) notFound();

  const product = await getDigitalProductBySlug(slug, productSlug);
  if (!product) notFound();

  return (
    <article>
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href={`/digital-products/${slug}`} className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> {category.title}
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            Product {product.index}
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{product.title}</h1>
        </div>
      </header>

      <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite">{product.description}</p>

          {product.features.length > 0 && (
            <div className="mt-8">
              <span className="label text-[10px]">FEATURES</span>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <li key={f} className="label border border-line px-2.5 py-1 text-[10px] text-graphite">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6">
            {product.price && (
              <div className="mb-6 flex items-baseline justify-between border-b border-line pb-6">
                <span className="label text-[10px]">PRICE</span>
                <span className="display text-3xl">₹{product.price.toLocaleString("en-IN")}</span>
              </div>
            )}
            <a
              href={whatsappUrl(`Hi ${siteConfig.name}, I'm interested in "${product.title}".`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
            >
              Enquire on WhatsApp
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
