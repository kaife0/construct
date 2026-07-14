"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowUpRight, AlertCircle } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { submitInquiry } from "@/lib/inquiries";

/**
 * Reusable inquiry form. Saves the lead to the DB (admin inbox) and offers a
 * WhatsApp shortcut for people who'd rather chat immediately.
 *
 * - `fixedService`  — lock the enquiry to one service (service detail pages).
 * - `serviceOptions` — show a service dropdown (home contact section).
 */
export function InquiryForm({
  fixedService,
  serviceOptions,
}: {
  fixedService?: string;
  serviceOptions?: string[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: fixedService ?? serviceOptions?.[0] ?? "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      await submitInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service: fixedService ?? (form.service || undefined),
        message: form.message,
      });
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Try again.");
      setStatus("idle");
    }
  };

  const whatsappText =
    `Hi ${siteConfig.name}!` +
    (fixedService ? `\nService: ${fixedService}` : form.service ? `\nService: ${form.service}` : "") +
    (form.name ? `\nName: ${form.name}` : "") +
    (form.message ? `\nMessage: ${form.message}` : "");

  const inputCls =
    "w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="label text-[10px]">INQUIRY FORM</span>
        <span className="label text-[10px] text-accent-strong">RESP. &lt; 24H</span>
      </div>

      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-4 py-6"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent-strong">
              <Check size={22} />
            </span>
            <div>
              <h3 className="text-lg font-semibold">Thanks — we&apos;ve got your message.</h3>
              <p className="mt-1 text-sm text-graphite">
                We usually reply within a day. Prefer to chat now?
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappUrl(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-white"
              >
                Chat on WhatsApp <ArrowUpRight size={16} />
              </a>
              <button
                type="button"
                onClick={() => {
                  setForm({ name: "", phone: "", email: "", service: fixedService ?? serviceOptions?.[0] ?? "", message: "" });
                  setStatus("idle");
                }}
                className="label text-ink underline-offset-4 hover:underline"
              >
                Send another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="grid gap-4"
          >
            {fixedService && (
              <p className="text-sm text-graphite">
                Enquiry about <span className="font-semibold text-ink">{fixedService}</span>
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label mb-2 block text-[11px]">Name</label>
                <input required value={form.name} onChange={update("name")} placeholder="Your name" className={inputCls} />
              </div>
              <div>
                <label className="label mb-2 block text-[11px]">Phone</label>
                <input required value={form.phone} onChange={update("phone")} placeholder="+91 …" className={inputCls} inputMode="tel" />
              </div>
            </div>

            {!fixedService && serviceOptions && serviceOptions.length > 0 && (
              <div>
                <label className="label mb-2 block text-[11px]">Service</label>
                <select value={form.service} onChange={update("service")} className={inputCls}>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                  <option>Other</option>
                </select>
              </div>
            )}

            <div>
              <label className="label mb-2 block text-[11px]">Message</label>
              <textarea required value={form.message} onChange={update("message")} rows={4} placeholder="Tell us about your plot, budget and timeline…" className={inputCls} />
            </div>

            {error && (
              <div className="flex items-start gap-2 border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-strong">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-opacity disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send inquiry"}
              </button>
              <a
                href={whatsappUrl(whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-graphite hover:text-ink"
              >
                or chat on WhatsApp
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
