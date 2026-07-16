import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/social-icons";
import { navLinks, siteConfig, whatsappUrl, telHref } from "@/lib/site";
import { getServices, getSiteSettings } from "@/lib/api";

export async function Footer() {
  const year = new Date().getFullYear();
  const [services, { contact, socials }] = await Promise.all([getServices(), getSiteSettings()]);

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
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`, contact.whatsappNumber)}
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
            <a href={socials.instagram} aria-label="Instagram" className="grid h-10 w-10 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
              <InstagramIcon />
            </a>
            <a href={socials.linkedin} aria-label="LinkedIn" className="grid h-10 w-10 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
              <LinkedinIcon />
            </a>
            <a href={socials.youtube} aria-label="YouTube" className="grid h-10 w-10 place-items-center border border-paper/20 transition-colors hover:border-accent hover:text-accent">
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
            {services.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="text-sm text-paper/70 transition-colors hover:text-accent">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="label text-paper/40">Get in touch</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={telHref(contact.phone)} className="flex items-center gap-2.5 text-sm text-paper/70 transition-colors hover:text-accent">
                <Phone size={15} /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm text-paper/70 transition-colors hover:text-accent">
                <Mail size={15} /> {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-paper/70">
              <MapPin size={15} /> {contact.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="label text-paper/40">© {year} {siteConfig.name}</p>
          <div className="flex items-center gap-4">
            <p className="label text-paper/40">Designed &amp; engineered for builders</p>
            <Link href="/admin" className="label text-paper/25 transition-colors hover:text-paper/50">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
