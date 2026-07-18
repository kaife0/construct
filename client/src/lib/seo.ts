import type { Metadata } from "next";
import { siteConfig, type SiteSettings } from "@/lib/site";

/** Canonical origin for the public site, e.g. "https://casastruct.com" (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Site-wide branded social card, served by app/opengraph-image.tsx at /opengraph-image.
 * Referenced explicitly (rather than left to Next's file-convention auto-injection) because
 * pages that set their own `openGraph` object otherwise emit no og:image at all.
 */
export const defaultOgImage = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
};

/**
 * Keyword bank derived from India house-design / civil-engineering search demand
 * (Hindi/Hinglish "naksha" terms, plot-size + BHK long-tails, Vastu, the calculator
 * cluster, and the local Sahibganj/Jharkhand intent). Per-page metadata picks the
 * relevant subset — search engines mostly ignore the meta keywords tag, but these
 * double as the vocabulary used in titles, descriptions and on-page copy.
 */
export const keywords = {
  brand: ["CasaStruct", "civil engineer", "structural consultant", "architectural services"],
  planning: [
    "house planning",
    "ghar ka naksha",
    "house naksha",
    "makan ka naksha",
    "house map",
    "house plan",
    "floor plan",
    "2 BHK house plan",
    "3 BHK house plan",
    "G+1 house plan",
    "20x30 house plan",
    "30x40 house plan",
    "Vastu house plan",
    "front elevation",
    "3D elevation",
  ],
  services: [
    "structural design",
    "interior design",
    "exterior elevation",
    "3D walkthrough",
    "bar bending schedule",
    "BBS",
    "estimation and costing",
    "BOQ",
    "building plan approval",
    "renovation",
  ],
  calculators: [
    "construction material calculator",
    "brick calculator",
    "cement calculator",
    "steel calculator",
    "concrete calculator",
    "sand calculator",
    "construction cost calculator",
  ],
  local: ["Sahibganj", "Rajmahal", "Jharkhand", "civil engineer near me"],
};

/** Everything, de-duplicated — used as the site-wide default keyword set. */
export const allKeywords = Array.from(
  new Set([...keywords.brand, ...keywords.planning, ...keywords.services, ...keywords.calculators, ...keywords.local])
);

type BuildArgs = {
  title?: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Absolute image URL(s); omit to fall back to the site-wide branded OG image. */
  images?: string[];
  type?: "website" | "article";
  /** Overrides the `path`-derived canonical — set only when a post declares its own. */
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  /** Social-card overrides; both fall back to `title` / `description`. */
  ogTitle?: string;
  ogDescription?: string;
};

/**
 * Builds a consistent page Metadata object: canonical URL + Open Graph + Twitter card.
 * `metadataBase` (set in the root layout) resolves the relative `path` to absolute.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  images,
  type = "website",
  canonical,
  noindex,
  nofollow,
  ogTitle,
  ogDescription,
}: BuildArgs): Metadata {
  const ogImages = images?.length ? images : [defaultOgImage];
  const twitterImages = images?.length ? images : [defaultOgImage.url];
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;
  return {
    ...(title ? { title } : {}),
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: canonical || path },
    ...(noindex || nofollow ? { robots: { index: !noindex, follow: !nofollow } } : {}),
    openGraph: {
      ...(socialTitle ? { title: socialTitle } : {}),
      description: socialDescription,
      url: path,
      type,
      siteName: siteConfig.name,
      locale: "en_IN",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      ...(socialTitle ? { title: socialTitle } : {}),
      description: socialDescription,
      images: twitterImages,
    },
  };
}

// ---- Structured data (JSON-LD) ------------------------------------------------

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: SITE_URL,
    description: siteConfig.description,
  };
}

/** The primary local-SEO entity — a civil-engineering practice with a real address, phone and service area. */
export function localBusinessJsonLd(settings: SiteSettings) {
  const { profile, contact, socials } = settings;
  const sameAs = [socials.instagram, socials.linkedin, socials.youtube].filter((u) => u && u !== "#");
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    telephone: contact.phone,
    email: contact.email,
    image: absoluteUrl("/opengraph-image"),
    address: { "@type": "PostalAddress", address: contact.location, addressCountry: "IN" },
    areaServed: contact.location,
    founder: { "@type": "Person", name: profile.name, jobTitle: profile.role },
    knowsAbout: [...keywords.services, ...keywords.planning],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function serviceJsonLd(args: { name: string; description: string; path: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    ...(args.image ? { image: args.image } : {}),
    provider: { "@type": "ProfessionalService", name: siteConfig.name, "@id": `${SITE_URL}/#business` },
    areaServed: "India",
  };
}

export function blogPostingJsonLd(args: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    url: absoluteUrl(args.path),
    mainEntityOfPage: absoluteUrl(args.path),
    ...(args.image ? { image: args.image } : {}),
    ...(args.datePublished ? { datePublished: args.datePublished } : {}),
    author: { "@type": "Person", name: args.authorName },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}

export function productJsonLd(args: {
  name: string;
  description: string;
  path: string;
  image?: string;
  price?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    ...(args.image ? { image: args.image } : {}),
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(args.price
      ? {
          offers: {
            "@type": "Offer",
            price: args.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(args.path),
          },
        }
      : {}),
  };
}

/** Drives Google's expandable FAQ rich result — fed by the per-post Q&A pairs. */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
