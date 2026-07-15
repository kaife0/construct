"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowUpRight } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { submitInquiry } from "@/lib/inquiries";

const EMPTY_FORM = { name: "", phone: "", email: "", service: "", message: "" };

/**
 * One action: opens WhatsApp with the enquiry pre-filled and saves the same
 * lead to the DB (categorised by service) for the admin inbox — not two
 * separate paths. WhatsApp opens synchronously on submit (before any await)
 * so popup blockers don't intercept it; the DB save happens in the
 * background and never blocks or fails the WhatsApp flow.
 *
 * - `fixedService`   — lock the enquiry to one service (service detail pages).
 * - `serviceOptions` — show a service dropdown (home contact section).
 */
export function InquiryForm({
  fixedService,
  serviceOptions,
  whatsappNumber,
}: {
  fixedService?: string;
  serviceOptions?: string[];
  whatsappNumber?: string;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, service: fixedService ?? serviceOptions?.[0] ?? "" });
  const [sent, setSent] = useState(false);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = fixedService ?? (form.service || undefined);

    const text =
      `Hi ${siteConfig.name}!` +
      (service ? `\nService: ${service}` : "") +
      `\nName: ${form.name}` +
      `\nMessage: ${form.message}`;

    window.open(whatsappUrl(text, whatsappNumber), "_blank", "noopener,noreferrer");
    setSent(true);

    submitInquiry({ ...form, email: form.email || undefined, service }).catch(() => {
      // Best-effort: WhatsApp already has the enquiry, so a save failure
      // here just means it's missing from the admin inbox — not worth
      // interrupting the user over.
    });
  };

  const inputCls =
    "w-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

  return (
    <div className="border border-line bg-surface p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="label text-[10px]">INQUIRY FORM</span>
        <span className="label text-[10px] text-accent-strong">RESP. &lt; 24H</span>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
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
              <h3 className="text-lg font-semibold">Opening WhatsApp…</h3>
              <p className="mt-1 text-sm text-graphite">Send the pre-filled message to complete your enquiry.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setForm({ ...EMPTY_FORM, service: fixedService ?? serviceOptions?.[0] ?? "" });
                setSent(false);
              }}
              className="label text-ink underline-offset-4 hover:underline"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={onSubmit} className="grid gap-4">
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

            <button
              type="submit"
              className="group inline-flex w-fit items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
            >
              Send via WhatsApp
              <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
