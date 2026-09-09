import Link from "next/link";
import {
  EnvelopeSimple,
  Phone,
  ArrowUpRight,
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
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({
  categories = [],
}: {
  categories?: ICategory[];
}) {
  return (
    <footer className="relative border-t border-line bg-[#0A0A0B] text-foreground overflow-hidden">
      {/* 2 Corner Markers on the Footer Frame */}
      <span className="frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner-tr" aria-hidden="true" />

      {/* Top Metadata Strip */}
      <div className="relative z-[40] border-b border-line/40 px-6 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[9px] tracking-widest text-muted/60 uppercase">
          <div className="flex items-center gap-2">
            <span className="signal-dot" />
            <span className="text-foreground/75 font-semibold">HK DESIGNS {"//"} SEQUENCE CLOSURE</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-muted/40">
            <span>24FPS EDITORIAL</span>
            <span>FRAME: 007 {"//"} FINAL</span>
          </div>
        </div>
      </div>

      <div className="relative z-[40] mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:gap-16">
          {/* Brand Column */}
          <div className="max-w-sm space-y-6">
            <Link
              href="/"
              className="inline-flex font-heading text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              HK DESIGNS
            </Link>

            <p className="font-sans text-sm leading-6 text-muted">
              Harish Kumar G — Graphic Designer at ETV Network. Building brand
              identity systems, posters and print collateral, product packaging,
              digital campaigns, and broadcast design assets.
            </p>

            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <a
                href={`mailto:${CONTACT.email}`}
                className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
              >
                <EnvelopeSimple weight="bold" className="shrink-0 text-foreground/70" />
                <span>{CONTACT.email}</span>
                <ArrowUpRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
              >
                <Phone weight="bold" className="shrink-0 text-foreground/70" />
                <span>{CONTACT.phoneDisplay} (WhatsApp)</span>
                <ArrowUpRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>

            {SOCIAL_LINKS.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-8 w-8 items-center justify-center rounded border border-line text-muted transition-colors hover:border-white/40 hover:text-foreground"
                    >
                      <Icon weight="bold" className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Disciplines Column */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
              DISCIPLINES
            </p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <Link
                    key={cat.slug}
                    href={`/work/${cat.slug}`}
                    className="group flex items-center justify-between font-sans text-xs font-medium text-muted transition-colors hover:text-foreground"
                  >
                    <span>{cat.name}</span>
                    <span className="font-mono text-[9px] text-muted/40 group-hover:text-foreground">
                      0{idx + 1}
                    </span>
                  </Link>
                ))
              ) : (
                <Link
                  href="/work"
                  className="font-sans text-xs font-medium text-muted hover:text-foreground"
                >
                  Selected Work
                </Link>
              )}
            </nav>
          </div>

          {/* Navigation Column */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
              INDEX
            </p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA Column */}
          <div className="shrink-0 lg:text-right">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
              COMMISSIONS
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all duration-300 hover:bg-white"
              >
                <span>INITIATE PROJECT</span>
                <ArrowUpRight size={12} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-line/40 pt-8 flex flex-col gap-4 font-mono text-[10px] text-muted/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HK DESIGNS. ALL RIGHTS RESERVED.</p>
          <p className="text-muted/40">ETV NETWORK {"//"} BROADCAST &amp; VISUAL DESIGN</p>
        </div>
      </div>
    </footer>
  );
}