"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";
import { fetchMe, logoutRequest, type AdminSession } from "@/lib/admin-auth";

export function AdminHeader() {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    fetchMe().then(setSession);
  }, []);

  const onLogout = async () => {
    await logoutRequest();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="border-b border-line">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center border border-ink text-[13px] font-semibold">C</span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">CasaStruct</span>
            <span className="label mt-1 text-[9px]">Admin</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session && <span className="hidden text-sm text-graphite sm:inline">{session.name}</span>}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1.5 text-sm font-medium text-graphite hover:text-ink sm:inline-flex"
          >
            View site
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="group inline-flex items-center gap-1.5 border border-line-strong px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
