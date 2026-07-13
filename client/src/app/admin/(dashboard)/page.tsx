import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Home as HomeIcon, FolderKanban, Newspaper, Inbox, Calculator, Settings, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const sections = [
  { icon: Wrench, title: "Services", desc: "Add, edit or remove the services shown on the site.", href: "/admin/services" },
  { icon: HomeIcon, title: "Ready-made Plans", desc: "Manage the plan catalogue shown on Home and Services." },
  { icon: FolderKanban, title: "Our Work", desc: "Completed and in-progress projects shown on About." },
  { icon: Newspaper, title: "Blog", desc: "Write and publish journal posts." },
  { icon: Inbox, title: "Inquiries", desc: "Leads submitted through the contact form." },
  { icon: Calculator, title: "Calculator Rates", desc: "Update ₹ material rates used by the calculators." },
  { icon: Settings, title: "Site Settings", desc: "Profile, contact details and socials." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <p className="label">Dashboard</p>
      <h1 className="display mt-3 text-3xl">Manage CasaStruct.</h1>
      <p className="mt-2 text-sm text-graphite">
        You&apos;re signed in. Content sections are being wired up one by one.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) =>
          s.href ? (
            <Link
              key={s.title}
              href={s.href}
              className="group border border-line bg-surface p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center border border-ink text-ink">
                  <s.icon size={18} />
                </span>
                <ArrowUpRight size={18} className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
              </div>
              <h2 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-1.5 text-sm text-graphite">{s.desc}</p>
              <span className="label mt-4 inline-block text-[10px] text-accent-strong">Manage →</span>
            </Link>
          ) : (
            <div key={s.title} className="border border-line bg-surface p-5 opacity-60">
              <span className="grid h-10 w-10 place-items-center border border-line-strong text-graphite">
                <s.icon size={18} />
              </span>
              <h2 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-1.5 text-sm text-graphite">{s.desc}</p>
              <span className="label mt-4 inline-block text-[10px] text-muted">Coming soon</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
