/**
 * Central site configuration.
 * NOTE: these are PLACEHOLDER values. In a later phase the contact details and
 * profile info become editable from the admin panel (SiteSettings collection).
 * The WhatsApp number must be full international format, digits only (no + or spaces).
 */

export const siteConfig = {
  name: "CasaStruct",
  tagline: "Build with confidence.",
  description:
    "Civil engineering and architectural services — house planning, structural design, interiors, and 2D/3D plans. Smart material calculators and ready-made plans.",
  contact: {
    phone: "+91 87977 86067",
    phoneHref: "tel:+918797786067",
    email: "adildream10@gmail.com",
    whatsappNumber: "918797786067", // intl format, digits only
    location: "India",
  },
  socials: {
    instagram: "#",
    linkedin: "#",
    youtube: "#",
  },
} as const;

/** Primary navigation links (public site). Contact lives on the home page, not a route. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Calculators", href: "/calculators" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Build a WhatsApp click-to-chat URL.
 * @param message optional prefilled message
 */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
