import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/social-icons";
import { navLinks, siteConfig, whatsappUrl } from "@/lib/site";

const services = [
  { label: "House Planning", href: "/services" },
  { label: "Structural Design", href: "/services" },
  { label: "Interior Design", href: "/services" },
  { label: "2D & 3D Plans", href: "/services" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      {/* CTA band */}
      <div className="border-b border-paper/10">
        <div className="container-x flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className="label text-paper/50">Let&apos;s build</p>
            <h2 className="display mt-4 max-w-xl text-3xl text-paper sm:text-5xl">
              Have a project in mind?
            </h2>
          </div>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-medium text-white"
          >
            Chat on WhatsApp
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center border border-paper text-[13px] font-semibold">C</span>
            <span className="text-[15px] font-semibold">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/55">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex gap-2.5">
            <a href={siteConfig.socials.instagram} aria-label="Instagram" className="grid h-9 w-9 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
              <InstagramIcon />
            </a>
            <a href={siteConfig.socials.linkedin} aria-label="LinkedIn" className="grid h-9 w-9 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
              <LinkedinIcon />
            </a>
            <a href={siteConfig.socials.youtube} aria-label="YouTube" className="grid h-9 w-9 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="label text-paper/40">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-paper/70 transition-colors hover:text-accent">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="label text-paper/40">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="text-sm text-paper/70 transition-colors hover:text-accent">{s.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="label text-paper/40">Get in touch</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2.5 text-sm text-paper/70 transition-colors hover:text-accent">
                <Phone size={15} /> {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2.5 text-sm text-paper/70 transition-colors hover:text-accent">
                <Mail size={15} /> {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-paper/70">
              <MapPin size={15} /> {siteConfig.contact.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="label text-paper/40">© {year} {siteConfig.name}</p>
          <p className="label text-paper/40">Designed &amp; engineered for builders</p>
        </div>
      </div>
    </footer>
  );
}
