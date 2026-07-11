"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Lock, AlertCircle } from "lucide-react";
import { loginRequest } from "@/lib/admin-auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginRequest(email, password);
      const from = searchParams.get("from");
      router.replace(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm border border-line bg-surface p-7"
    >
      <span className="grid h-10 w-10 place-items-center border border-ink text-ink">
        <Lock size={18} />
      </span>
      <h1 className="display mt-5 text-2xl">Admin login</h1>
      <p className="mt-1.5 text-sm text-graphite">Sign in to manage CasaStruct content.</p>

      <div className="mt-7 grid gap-4">
        <div>
          <label className="label mb-2 block text-[11px]">Email</label>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="label mb-2 block text-[11px]">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-strong">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-sm bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </motion.form>
  );
}
