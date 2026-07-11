import { AdminHeader } from "@/components/admin/admin-header";

/** Shared chrome for authenticated admin pages (everything except /admin/login). */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main className="container-x py-10">{children}</main>
    </>
  );
}
