"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig, whatsappUrl } from "@/lib/site";

export function Navbar({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change — adjusted during render (React's
  // recommended pattern) rather than in an effect, which would cause an
  // extra render pass.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-paper/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-[4.5rem]">
        {/* Wordmark */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label={siteConfig.name}>
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden border border-ink text-[13px] font-semibold">
            <span className="relative z-10 transition-colors group-hover:text-paper">C</span>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 group-hover:scale-y-100" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <Link
                href={link.href}
                className={cn(
                  "text-[13px] font-medium tracking-tight transition-colors",
                  isActive(link.href) ? "text-ink" : "text-graphite hover:text-ink"
                )}
              >
                {link.label}
              </Link>
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 h-px w-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`, whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2.5 text-[13px] font-medium text-paper"
          >
            Start a project
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <ul className="container-x flex flex-col py-2">
              {navLinks.map((link, i) => (
                <li key={link.href} className="border-b border-line/70 last:border-0">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between py-3.5 text-base font-medium",
                      isActive(link.href) ? "text-ink" : "text-graphite"
                    )}
                  >
                    <span>{link.label}</span>
                    <span className="label text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
              <li className="py-4">
                <a
                  href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to discuss a project.`, whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-sm bg-ink px-4 py-3.5 text-base font-medium text-paper"
                >
                  Start a project <ArrowUpRight size={17} />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
