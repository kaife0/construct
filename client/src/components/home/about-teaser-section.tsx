import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/api";

export async function AboutTeaserSection() {
  const { profile } = await getSiteSettings();
  return (
    <section className="border-t border-line">
      <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="label">(05) — The engineer</p>
          <h2 className="display mt-4 max-w-lg text-3xl sm:text-4xl">
            Engineering that&apos;s meant to be invisible — it just works.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-graphite">{profile.intro}</p>
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent-strong"
          >
            About {profile.name}
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6">
            <span className="label text-[10px]">PROFILE</span>
            <p className="mt-3 text-xl font-semibold tracking-tight">{profile.name}</p>
            <p className="text-sm text-graphite">{profile.role}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.credentials.map((c) => (
                <li key={c} className="label border border-line px-2.5 py-1 text-[10px] text-graphite">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
