import { ArrowUpRight } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/lib/site";

/** Reusable end-of-page CTA banner — heading + WhatsApp button. */
export function WhatsAppCtaSection({
  heading,
  message,
  buttonLabel = "Ask on WhatsApp",
}: {
  heading: string;
  message: string;
  buttonLabel?: string;
}) {
  return (
    <section className="border-t border-line">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
        <h2 className="display max-w-md text-2xl sm:text-3xl">{heading}</h2>
        <a
          href={whatsappUrl(`Hi ${siteConfig.name}, ${message}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium text-paper"
        >
          {buttonLabel}
          <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}
