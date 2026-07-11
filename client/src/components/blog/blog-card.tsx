import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/content";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
        <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-[10px]">{post.category}</span>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold tracking-tight sm:text-lg">{post.title}</h2>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-graphite sm:text-sm">
          {post.excerpt}
        </p>
        <span className="label mt-auto pt-4 text-[10px]">
          {fmtDate(post.date)} · {post.readMins} min read
        </span>
      </div>
    </Link>
  );
}
