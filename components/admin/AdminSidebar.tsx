"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Gauge,
  Newspaper,
  Briefcase,
  Envelope,
  SignOut,
  List,
  X,
  Tag,
} from "@phosphor-icons/react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: Gauge },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Work", href: "/admin/work", icon: Briefcase },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Leads", href: "/admin/leads", icon: Envelope },
];

function Logo() {
  return (
    <Link href="/admin" className="flex items-center gap-2">
      <span className="font-heading text-2xl font-bold tracking-tight text-foreground uppercase">
        HK DESIGNS
      </span>
    </Link>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto px-4">
      {NAV_LINKS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 font-sans text-sm font-medium transition-colors ${
              active
                ? "bg-surface text-foreground font-semibold border border-line"
                : "text-muted hover:bg-surface/50 hover:text-foreground"
            }`}
          >
            <Icon size={18} weight={active ? "fill" : "regular"} className={active ? "text-foreground" : "text-muted"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ email }: { email?: string | null }) {
  return (
    <div className="shrink-0 border-t border-line px-4 pb-8 pt-4">
      {email && (
        <p className="truncate font-mono text-xs text-muted" title={email}>
          {email}
        </p>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground cursor-pointer"
      >
        <SignOut size={18} />
        Sign out
      </button>
    </div>
  );
}

export default function AdminSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-line bg-background px-5 py-4 md:hidden">
        <div>
          <Logo />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            ADMIN CMS
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-foreground transition-colors hover:bg-surface"
        >
          <List size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-line bg-background md:flex">
        <div className="shrink-0 px-5 pt-8">
          <Logo />
          <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
            ADMIN CMS
          </p>
        </div>
        <SidebarNav pathname={pathname} />
        <SidebarFooter email={email} />
      </aside>

      {/* Mobile sheet backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile sheet panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[80vw] flex-col overflow-hidden border-r border-line bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-8">
          <div>
            <Logo />
            <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              ADMIN CMS
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-foreground transition-colors hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={() => setIsOpen(false)} />
        <SidebarFooter email={email} />
      </div>
    </>
  );
}
