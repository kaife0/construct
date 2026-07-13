import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4">
      <Link
        href="/"
        className="label absolute left-4 top-4 inline-flex items-center gap-1.5 text-graphite hover:text-ink sm:left-6 sm:top-6"
      >
        <ArrowLeft size={14} /> Back to website
      </Link>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
