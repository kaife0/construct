import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { getPosts, getPostBySlug, getSiteSettings } from "@/lib/api";
import { buildMetadata, blogPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Journal" };
  const { seo } = post;
  const socialImage = seo.ogImage || post.image;
  return buildMetadata({
    title: seo.metaTitle || post.title,
    description: seo.metaDescription || post.excerpt,
    path: `/blog/${slug}`,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    images: socialImage ? [socialImage] : undefined,
    type: "article",
    canonical: seo.canonicalUrl || undefined,
    noindex: seo.noindex,
    nofollow: seo.nofollow,
    ogTitle: seo.ogTitle || undefined,
    ogDescription: seo.ogDescription || undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, { profile }] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();

  // Admin-authored only (no public submission path), so rendering straight to HTML is safe.
  // The editor stores HTML; posts written before it still hold Markdown, hence the fallback.
  const source = post.content || post.excerpt;
  const html = source.trimStart().startsWith("<") ? source : (marked.parse(source, { async: false }) as string);
  const { faqs } = post.seo;

  return (
    <article>
      <JsonLd
        data={[
          blogPostingJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${slug}`,
            image: post.image,
            datePublished: post.date,
            authorName: profile.name,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
          ...(faqs.length ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <header className="border-b border-line">
        <div className="container-x py-14 md:py-20">
          <Link href="/blog" className="label inline-flex items-center gap-1.5 text-graphite hover:text-ink">
            <ArrowLeft size={14} /> Journal
          </Link>
          <p className="label mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            {post.category} · {fmtDate(post.date)} · {post.readMins} min read
          </p>
          <h1 className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{post.title}</h1>
        </div>
      </header>

      <div className="container-x pt-10 md:pt-14">
        <div className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden border border-line">
          <Image
            src={post.image}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="container-x py-10 md:py-14">
        <Reveal>
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
        </Reveal>

        {/* Rendered, not just structured data — Google only grants the FAQ rich result when the answers are visible. */}
        {faqs.length > 0 && (
          <Reveal>
            <section className="mt-14 max-w-3xl border-t border-line pt-10">
              <h2 className="display text-2xl">Frequently asked questions</h2>
              <dl className="mt-6 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-base font-medium text-ink">{faq.question}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-graphite">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>
        )}
      </div>
    </article>
  );
}
