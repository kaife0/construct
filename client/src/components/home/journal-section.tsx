import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { posts } from "@/lib/content";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function JournalSection() {
  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label">(06) — Journal</p>
            <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">Notes from the field.</h2>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink">
            Read the blog
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 border-t border-line">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-12 items-center gap-4 border-b border-line py-7 transition-colors hover:bg-surface"
              >
                <span className="label col-span-4 sm:col-span-2">{post.category}</span>
                <h3 className="col-span-12 text-lg font-semibold tracking-tight sm:col-span-6 sm:text-xl">{post.title}</h3>
                <span className="label col-span-8 sm:col-span-3">{fmtDate(post.date)} · {post.readMins} min</span>
                <span className="col-span-4 hidden justify-self-end text-graphite transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink sm:col-span-1 sm:flex">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
