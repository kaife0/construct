import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — CasaStruct Admin" },
  robots: { index: false, follow: false },
};

/** Minimal shell for everything under /admin — deliberately no public nav/footer. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
