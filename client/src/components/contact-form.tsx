"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowUpRight } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";

/**
 * Inquiry form. For now it builds a prefilled WhatsApp message on submit (no
 * backend needed yet). In Phase 5 the submit handler will also POST to
 * /api/inquiry to store the lead in MongoDB for the admin inbox.
 */

const services = ["House Planning", "Structural Design", "Interior Design", "2D & 3D Plans", "Estimation", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", service: services[0], message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `Hi ${siteConfig.name}!\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Service: ${form.service}\n` +
      `Message: ${form.message}`;
    setSent(true);
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
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
              <p className="mt-1 text-sm text-graphite">
                Your details are prefilled — just hit send in WhatsApp. Prefer email?
                Write to{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
                  {siteConfig.contact.email}
                </a>.
              </p>
            </div>
            <button type="button" onClick={() => setSent(false)} className="label text-ink underline-offset-4 hover:underline">
              ← Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="grid gap-4"
          >
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
            <div>
              <label className="label mb-2 block text-[11px]">Service</label>
              <select value={form.service} onChange={update("service")} className={inputCls}>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label mb-2 block text-[11px]">Message</label>
              <textarea required value={form.message} onChange={update("message")} rows={4} placeholder="Tell us about your plot, budget and timeline…" className={inputCls} />
            </div>
            <button
              type="submit"
              className="group mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
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
