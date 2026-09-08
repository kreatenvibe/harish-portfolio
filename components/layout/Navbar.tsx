"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CaretDown, ArrowUpRight, List, X } from "@phosphor-icons/react";
import { Timecode } from "@/components/frame/Timecode";
import type { ICategory } from "@/database";

export default function Navbar({
  categories = [],
}: {
  categories?: ICategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "";

  const isWorkActive = pathname.startsWith("/work");
  const isAboutActive = pathname.startsWith("/about");
  const isServicesActive = pathname.startsWith("/services");
  const isBlogActive = pathname.startsWith("/blog");
  const isContactActive = pathname.startsWith("/contact");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "hud-glass border-b border-line py-3"
            : "bg-[#0A0A0B]/90 backdrop-blur-md border-b border-line/40 py-4"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo & Callout */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group relative flex items-center font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              <span>HK DESIGNS</span>
              <span className="ml-3 font-mono text-[9px] tracking-widest text-muted/60 uppercase hidden sm:inline-block">
                {"//"} VISUAL DESIGN × PAINT &amp; ROTO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-7 md:flex">
            {/* Work dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWorkDropdownOpen(true)}
              onMouseLeave={() => setWorkDropdownOpen(false)}
            >
              <Link
                href="/work"
                className={`flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isWorkActive
                    ? "text-foreground font-bold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span>Work</span>
                {categories.length > 0 && (
                  <CaretDown
                    size={11}
                    weight="bold"
                    className={`transition-transform duration-200 ${
                      workDropdownOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                )}
              </Link>

              {categories.length > 0 && workDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-60">
                  <div className="rounded border border-line bg-[#161619] p-2 shadow-2xl backdrop-blur-2xl">
                    <Link
                      href="/work"
                      className={`block rounded px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        pathname === "/work"
                          ? "bg-white/10 text-foreground"
                          : "text-muted hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      [ ALL PROJECTS ]
                    </Link>
                    <div className="my-1.5 h-px bg-line/60" />
                    {categories.map((cat, idx) => {
                      const isActive = pathname === `/work/${cat.slug}`;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/work/${cat.slug}`}
                          className={`flex items-center justify-between rounded px-3.5 py-2 font-sans text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-foreground font-semibold"
                              : "text-muted hover:bg-white/5 hover:text-foreground"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="font-mono text-[9px] text-muted/40">
                            0{idx + 1}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/services"
              className={`font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
                isServicesActive
                  ? "text-foreground font-bold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Services
            </Link>

            <Link
              href="/about"
              className={`font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
                isAboutActive
                  ? "text-foreground font-bold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              About
            </Link>

            <Link
              href="/blog"
              className={`font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
                isBlogActive
                  ? "text-foreground font-bold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`font-sans text-xs font-semibold uppercase tracking-widest transition-colors ${
                isContactActive
                  ? "text-foreground font-bold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Timecode & CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <Timecode />

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded border border-line bg-surface px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <span>INQUIRE</span>
              <ArrowUpRight size={11} weight="bold" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              className="flex h-9 w-9 items-center justify-center rounded border border-line bg-surface text-foreground transition-colors hover:border-white/40"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-4/5 max-w-sm border-l border-line bg-[#0E0E10] backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between px-6 py-16 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
              NAVIGATION
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          {/* Work & Categories */}
          <div>
            <Link
              href="/work"
              className={`font-heading text-2xl font-bold uppercase transition-colors ${
                isWorkActive ? "text-foreground font-black" : "text-muted hover:text-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Work
            </Link>

            {categories.length > 0 && (
              <div className="mt-3 ml-3 flex flex-col gap-2.5 border-l border-line pl-3.5">
                <Link
                  href="/work"
                  className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  [ All Projects ]
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/work/${cat.slug}`}
                    className={`font-sans text-sm font-medium transition-colors ${
                      pathname === `/work/${cat.slug}`
                        ? "text-foreground font-semibold"
                        : "text-muted hover:text-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/services"
            className={`font-heading text-2xl font-bold uppercase transition-colors ${
              isServicesActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>

          <Link
            href="/about"
            className={`font-heading text-2xl font-bold uppercase transition-colors ${
              isAboutActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          <Link
            href="/blog"
            className={`font-heading text-2xl font-bold uppercase transition-colors ${
              isBlogActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`font-heading text-2xl font-bold uppercase transition-colors ${
              isContactActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>

        <div className="border-t border-line pt-6">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded border border-line bg-surface py-3 text-center font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-white/10 hover:border-white/40"
            onClick={() => setIsOpen(false)}
          >
            <span>Start Your Project</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </>
  );
}