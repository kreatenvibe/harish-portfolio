import Link from "next/link";
import type { ReactNode } from "react";

const BASE =
  "group relative inline-flex items-center gap-4 rounded-full py-1.5 pl-6 pr-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2";

const VARIANTS = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-offset-background",
  accent:
    "bg-white text-background hover:bg-white/90 focus-visible:ring-offset-white",
  ghost:
    "bg-transparent text-foreground hover:text-white focus-visible:ring-offset-background",
  "ghost-dark":
    "bg-transparent text-white hover:text-white/70 focus-visible:ring-offset-background",
} as const;

const ICON_SHELL = {
  primary: "bg-background/10 text-background",
  accent: "bg-primary/5 text-primary",
  ghost: "bg-foreground/5 text-foreground",
  "ghost-dark": "bg-white/10 text-white",
} as const;

export function CtaButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  const isGhost = variant === "ghost" || variant === "ghost-dark";

  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${isGhost ? "!py-3.5 !pl-2 !pr-2" : ""}`}>
      {children}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ICON_SHELL[variant]}`}
        aria-hidden
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
