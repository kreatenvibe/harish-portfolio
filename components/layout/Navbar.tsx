"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/40 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="z-50 relative flex items-center"
          >
            <Image
              src="/logo/kreatenvibe-logo.png"
              alt="KreatenVibe Logo"
              width={180}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-sans text-sm font-medium transition-colors ${
                    active
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 md:block ml-4"
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Side Sheet */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-3/4 max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col px-6 py-24 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-heading text-2xl font-semibold transition-colors ${
                  active
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="mt-6 rounded-full bg-primary px-6 py-3.5 text-center font-sans text-sm font-semibold text-white transition-transform active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </>
  );
}