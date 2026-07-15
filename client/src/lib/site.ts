/** Site brand identity — name, tagline, meta description, nav links. Static, not admin-editable. */
export const siteConfig = {
  name: "CasaStruct",
  tagline: "Build with confidence.",
  description:
    "Civil engineering and architectural services — house planning, structural design, interiors, and 2D/3D plans. Smart material calculators and ready-made plans.",
} as const;

/** Primary navigation links (public site). Contact lives on the home page, not a route. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Digital Products", href: "/digital-products" },
  { label: "Calculators", href: "/calculators" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Admin-editable profile, achievements, contact and social details — served from the
 * `SiteSettings` model via `getSiteSettings()` in `@/lib/api`, edited from the admin panel.
 * `defaultSiteSettings` is the fallback used if that fetch ever fails.
 */
export type SiteSettings = {
  profile: {
    name: string;
    role: string;
    intro: string;
    bio: string[];
    credentials: string[];
    stats: { projects: number; experienceYears: number; cities: number };
  };
  achievements: { year: string; title: string; desc: string }[];
  contact: {
    phone: string;
    email: string;
    whatsappNumber: string; // intl format, digits only
    location: string;
  };
  socials: { instagram: string; linkedin: string; youtube: string };
};

export const defaultSiteSettings: SiteSettings = {
  profile: {
    name: "Er. A. Sharma",
    role: "Civil Engineer & Structural Consultant",
    intro:
      "Fourteen years of turning plots into homes and ideas into buildable, code-compliant structures across residential and commercial projects.",
    bio: [
      "I'm a practising civil engineer specialising in structural design and end-to-end home planning. My work spans everything from a first floor-plan sketch to the bar-bending schedule your contractor builds from.",
      "I believe good engineering is invisible — it just works, lasts, and stays within budget. Every project gets the same discipline: careful analysis, honest costing, and drawings clear enough to build without guesswork.",
    ],
    credentials: ["B.E. Civil Engineering", "Chartered Engineer (India)", "Licensed Structural Engineer", "STAAD.Pro / AutoCAD / Revit"],
    stats: { projects: 500, experienceYears: 14, cities: 60 },
  },
  achievements: [
    { year: "2024", title: "500th project delivered", desc: "Crossed 500 completed residential & commercial projects." },
    { year: "2021", title: "Commercial complex, RCC design", desc: "Lead structural consultant for a 6-storey mixed-use build." },
    { year: "2018", title: "Featured — regional builders' expo", desc: "Invited speaker on cost-efficient RCC design." },
    { year: "2010", title: "Practice established", desc: "Started independent consulting practice." },
  ],
  contact: {
    phone: "+91 87977 86067",
    email: "adildream10@gmail.com",
    whatsappNumber: "918797786067",
    location: "Rajmahal, Sahibganj, Jharkhand, India",
  },
  socials: { instagram: "#", linkedin: "#", youtube: "#" },
};

/**
 * Build a WhatsApp click-to-chat URL.
 * @param message optional prefilled message
 * @param number intl-format WhatsApp number, digits only — pass the live `settings.contact.whatsappNumber` when available
 */
export function whatsappUrl(message?: string, number: string = defaultSiteSettings.contact.whatsappNumber) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** `tel:` link for a phone number, e.g. "+91 87977 86067" -> "tel:+918797786067". */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
