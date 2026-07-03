import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Practical notes on planning, estimation and structural design.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function BlogPage() {
  return (
    <>
      <PageHeader
        index="06"
        label="Journal"
        title="Notes from the field."
        lede="Practical, jargon-free notes on planning, estimation and structural design."
      />

      <section>
        <div className="container-x py-12 md:py-16">
          <div className="border-t border-line">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-8 transition-colors hover:bg-surface"
                >
                  <span className="label col-span-6 sm:col-span-2">{post.category}</span>
                  <div className="col-span-12 sm:col-span-7">
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{post.title}</h2>
                    <p className="mt-2 max-w-xl text-sm text-graphite">{post.excerpt}</p>
                  </div>
                  <span className="label col-span-6 sm:col-span-2">{fmtDate(post.date)} · {post.readMins} min</span>
                  <span className="col-span-6 hidden justify-self-end text-graphite transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink sm:col-span-1 sm:flex">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
