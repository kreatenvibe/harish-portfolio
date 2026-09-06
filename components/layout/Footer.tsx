import Link from "next/link";
import {
  EnvelopeSimple,
  Phone,
  InstagramLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CONTACT, SOCIAL_LINKS } from "@/lib/contact";
import type { ICategory } from "@/database";

const SOCIAL_ICONS = {
  Instagram: InstagramLogo,
  "Twitter / X": XLogo,
  YouTube: YoutubeLogo,
} as const;

const navigationLinks = [
  { label: "All Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer({
  categories = [],
}: {
  categories?: ICategory[];
}) {
  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:gap-16">
          {/* Brand Column */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex font-heading text-2xl font-bold tracking-tight text-white"
            >
              HK<span className="text-accent">Designs</span>
            </Link>

            <p className="mt-5 font-sans text-sm leading-6 text-white/60">
              Harish Kumar G — Graphic designer and Paint &amp; Roto artist
              delivering brand identity systems, packaging, social campaigns,
              print design, and frame-accurate VFX cleanup.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 font-sans text-sm text-white/70 transition-colors hover:text-white"
              >
                <EnvelopeSimple weight="bold" className="shrink-0" />
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-sm text-white/70 transition-colors hover:text-white"
              >
                <Phone weight="bold" className="shrink-0" />
                {CONTACT.phoneDisplay}
              </a>
            </div>

            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <Icon weight="bold" className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/40">
              Disciplines
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/work/${cat.slug}`}
                    className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))
              ) : (
                <Link
                  href="/work"
                  className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  Work
                </Link>
              )}
            </nav>
          </div>

          {/* Navigation Column */}
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/40">
              Navigation
            </p>
            <nav className="mt-4 flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA Column */}
          <div className="shrink-0 lg:text-right">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/40">
              Get Started
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-accent px-6 py-3 font-sans text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col gap-3 font-sans text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HK Designs. All rights reserved.</p>
          <p>Graphic Designer &amp; Paint &amp; Roto Artist.</p>
        </div>
      </div>
    </footer>
  );
}