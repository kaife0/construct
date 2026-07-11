import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { posts } from "@/lib/content";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Journal", description: post?.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article>
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
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-graphite">
            <p className="text-lg text-ink">{post.excerpt}</p>
            <p>
              This is placeholder article content. In the blog phase, full posts will be
              authored from the admin panel and stored in the database, with rich text,
              images and diagrams.
            </p>
            <p>
              Each article will walk through a practical topic step by step — with the kind
              of field-tested detail a homeowner or builder can actually act on.
            </p>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
