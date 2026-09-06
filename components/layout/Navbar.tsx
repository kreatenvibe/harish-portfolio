"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
import type { ICategory } from "@/database";

export default function Navbar({
  categories = [],
}: {
  categories?: ICategory[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [workDropdownOpen, setWorkDropdownOpen] = useState(false);
  const pathname = usePathname() || "";

  const isWorkActive = pathname.startsWith("/work");
  const isAboutActive = pathname.startsWith("/about");
  const isBlogActive = pathname.startsWith("/blog");
  const isContactActive = pathname.startsWith("/contact");

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-md border-b border-foreground/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="z-50 relative flex items-center font-heading text-xl font-bold tracking-tight text-foreground"
          >
            HK<span className="text-accent">Designs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {/* Work dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setWorkDropdownOpen(true)}
              onMouseLeave={() => setWorkDropdownOpen(false)}
            >
              <Link
                href="/work"
                className={`flex items-center gap-1 font-sans text-sm font-medium transition-colors ${
                  isWorkActive
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
              >
                Work
                {categories.length > 0 && (
                  <CaretDown
                    size={13}
                    weight="bold"
                    className={`transition-transform duration-200 ${
                      workDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>

              {categories.length > 0 && workDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56">
                  <div className="rounded-xl border border-foreground/10 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
                    <Link
                      href="/work"
                      className={`block rounded-lg px-3.5 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-colors ${
                        pathname === "/work"
                          ? "bg-foreground/10 text-accent"
                          : "text-muted hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      All Projects
                    </Link>
                    <div className="my-1.5 h-px bg-foreground/10" />
                    {categories.map((cat) => {
                      const isActive = pathname === `/work/${cat.slug}`;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/work/${cat.slug}`}
                          className={`block rounded-lg px-3.5 py-2 font-sans text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-accent/15 text-accent"
                              : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                          }`}
                        >
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`font-sans text-sm font-medium transition-colors ${
                isAboutActive
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              About
            </Link>

            <Link
              href="/blog"
              className={`font-sans text-sm font-medium transition-colors ${
                isBlogActive
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`font-sans text-sm font-medium transition-colors ${
                isContactActive
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden rounded-full bg-foreground px-5 py-2.5 font-sans text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 md:block ml-4"
          >
            Start Your Project
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 md:hidden z-50 relative focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Offcanvas Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-screen w-4/5 max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col px-6 py-20 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-5">
          {/* Work & Categories */}
          <div>
            <Link
              href="/work"
              className={`font-heading text-2xl font-bold transition-colors ${
                isWorkActive ? "text-accent" : "text-foreground hover:text-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Work
            </Link>

            {categories.length > 0 && (
              <div className="mt-2.5 ml-3 flex flex-col gap-2 border-l-2 border-foreground/10 pl-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/work/${cat.slug}`}
                    className={`font-sans text-sm font-medium transition-colors ${
                      pathname === `/work/${cat.slug}`
                        ? "text-accent font-semibold"
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
            href="/about"
            className={`font-heading text-2xl font-bold transition-colors ${
              isAboutActive ? "text-accent" : "text-foreground hover:text-accent"
            }`}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>

          <Link
            href="/blog"
            className={`font-heading text-2xl font-bold transition-colors ${
              isBlogActive ? "text-accent" : "text-foreground hover:text-accent"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`font-heading text-2xl font-bold transition-colors ${
              isContactActive ? "text-accent" : "text-foreground hover:text-accent"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <Link
            href="/contact"
            className="mt-6 rounded-full bg-foreground px-6 py-3.5 text-center font-sans text-sm font-semibold text-background transition-transform active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </>
  );
}