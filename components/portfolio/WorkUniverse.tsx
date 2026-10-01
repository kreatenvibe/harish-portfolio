"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FrameCounter } from "@/components/frame/FrameCounter";
import type { ICategory } from "@/database";

interface WorkUniverseProps {
  categories: ICategory[];
}

interface DisciplineVisualConfig {
  subtitle: string;
  description: string;
  tag: string;
  specs: string[];
}

const DISCIPLINE_VISUALS: Record<string, DisciplineVisualConfig> = {
  branding: {
    subtitle: "Identity / Systems / Vector Language",
    description:
      "Precision vector systems, mathematical alignment grids, responsive logo marks, and scalable brand identity guidelines.",
    tag: "01 // BRANDING & IDENTITY",
    specs: ["GRID RATIO", "BEZIER VECTORS", "SCALABLE SYSTEMS"],
  },
  packaging: {
    subtitle: "Dielines / Surfaces / Product Presentation",
    description:
      "Physical box dielines, layered surface finishes, tactile label composition, and high-impact retail presence.",
    tag: "02 // PACKAGING DESIGN",
    specs: ["STRUCTURAL DIELINES", "CMYK + SPOT", "SURFACE FINISHES"],
  },
  "social-media": {
    subtitle: "Campaigns / Motion / Digital Communication",
    description:
      "High-cadence vertical formats, dynamic broadcast motion, typographic pacing, and multi-channel digital campaigns.",
    tag: "03 // SOCIAL & MOTION",
    specs: ["9:16 VERTICAL", "MOTION PACING", "BROADCAST ASSETS"],
  },
  "print-design": {
    subtitle: "Editorial / Typography / Physical Production",
    description:
      "Publication layouts, physical print registration marks, bespoke typography hierarchies, and tactile editorial spreads.",
    tag: "04 // PRINT & EDITORIAL",
    specs: ["300 DPI MASTER", "TRIM & BLEED", "GRID HIERARCHY"],
  },
};

function DisciplineSpecBadge({ slug }: { slug: string }) {
  if (slug === "branding") {
    return (
      <div className="relative h-24 w-full rounded border border-line/50 bg-[#0E0E11] p-3 flex items-center justify-between overflow-hidden">
        <svg
          viewBox="0 0 160 80"
          className="h-full w-auto text-white/40 group-hover:text-white/80 transition-colors"
          fill="none"
          stroke="currentColor"
        >
          {/* Construction grid circles */}
          <circle cx="50" cy="40" r="30" strokeWidth="0.8" strokeDasharray="3 2" className="opacity-40" />
          <circle cx="70" cy="40" r="22" strokeWidth="0.8" className="opacity-60" />
          <circle cx="50" cy="40" r="14" strokeWidth="1" />
          {/* Tangent guide lines */}
          <line x1="10" y1="40" x2="150" y2="40" strokeWidth="0.6" strokeDasharray="2 2" className="opacity-30" />
          <line x1="50" y1="5" x2="50" y2="75" strokeWidth="0.6" strokeDasharray="2 2" className="opacity-30" />
          <line x1="20" y1="10" x2="120" y2="70" strokeWidth="0.8" className="opacity-50" />
          {/* Vector anchor points */}
          <rect x="47.5" y="9" width="5" height="5" fill="currentColor" strokeWidth="0" />
          <rect x="77.5" y="37.5" width="5" height="5" fill="currentColor" strokeWidth="0" />
          <rect x="47.5" y="67.5" width="5" height="5" fill="currentColor" strokeWidth="0" />
          <rect x="17.5" y="37.5" width="5" height="5" fill="currentColor" strokeWidth="0" />
        </svg>
        <div className="font-mono text-[9px] text-muted/60 space-y-1 text-right">
          <div className="text-foreground/80 font-semibold uppercase">VECTOR // LOGO GRID</div>
          <div>RATIO: 1:1.618</div>
          <div>CURVATURE: BEZIER</div>
        </div>
      </div>
    );
  }

  if (slug === "packaging") {
    return (
      <div className="relative h-24 w-full rounded border border-line/50 bg-[#0E0E11] p-3 flex items-center justify-between overflow-hidden">
        <svg
          viewBox="0 0 160 80"
          className="h-full w-auto text-white/40 group-hover:text-white/80 transition-colors"
          fill="none"
          stroke="currentColor"
        >
          {/* Box Dieline Outline */}
          <rect x="25" y="18" width="110" height="44" strokeWidth="1" />
          {/* Crease / fold dashed lines */}
          <line x1="55" y1="18" x2="55" y2="62" strokeWidth="0.8" strokeDasharray="3 2" className="opacity-70" />
          <line x1="85" y1="18" x2="85" y2="62" strokeWidth="0.8" strokeDasharray="3 2" className="opacity-70" />
          <line x1="115" y1="18" x2="115" y2="62" strokeWidth="0.8" strokeDasharray="3 2" className="opacity-70" />
          {/* Top & bottom tuck flaps */}
          <path d="M 55 18 L 60 8 L 80 8 L 85 18" strokeWidth="0.8" className="opacity-60" />
          <path d="M 55 62 L 60 72 L 80 72 L 85 62" strokeWidth="0.8" className="opacity-60" />
          {/* Glue flap */}
          <path d="M 25 22 L 15 26 L 15 54 L 25 58" strokeWidth="0.8" className="opacity-60" />
        </svg>
        <div className="font-mono text-[9px] text-muted/60 space-y-1 text-right">
          <div className="text-foreground/80 font-semibold uppercase">STRUCTURAL DIELINE</div>
          <div>FOLD: 85 × 140 × 45MM</div>
          <div>STOCK: 350GSM ARTBOARD</div>
        </div>
      </div>
    );
  }

  if (slug === "social-media") {
    return (
      <div className="relative h-24 w-full rounded border border-line/50 bg-[#0E0E11] p-3 flex items-center justify-between overflow-hidden">
        <svg
          viewBox="0 0 160 80"
          className="h-full w-auto text-white/40 group-hover:text-white/80 transition-colors"
          fill="none"
          stroke="currentColor"
        >
          {/* 9:16 Canvas Frame */}
          <rect x="62" y="6" width="38" height="68" rx="4" strokeWidth="1" />
          {/* Safe Area Guides */}
          <rect x="66" y="16" width="30" height="48" strokeWidth="0.6" strokeDasharray="2 2" className="opacity-40" />
          {/* Screen elements */}
          <circle cx="81" cy="69" r="1.5" fill="currentColor" strokeWidth="0" className="opacity-50" />
          <line x1="70" y1="28" x2="92" y2="28" strokeWidth="1" />
          <line x1="70" y1="34" x2="86" y2="34" strokeWidth="0.8" className="opacity-60" />
          <path d="M 68 52 Q 81 42 94 52" strokeWidth="0.8" className="opacity-60" />
        </svg>
        <div className="font-mono text-[9px] text-muted/60 space-y-1 text-right">
          <div className="text-foreground/80 font-semibold uppercase">DIGITAL & MOTION SPECS</div>
          <div>FRAME: 1080 × 1920 (9:16)</div>
          <div>FPS: 60FPS BROADCAST</div>
        </div>
      </div>
    );
  }

  // Print & Editorial
  return (
    <div className="relative h-24 w-full rounded border border-line/50 bg-[#0E0E11] p-3 flex items-center justify-between overflow-hidden">
      <svg
        viewBox="0 0 160 80"
        className="h-full w-auto text-white/40 group-hover:text-white/80 transition-colors"
        fill="none"
        stroke="currentColor"
      >
        {/* Magazine Spread Outline */}
        <rect x="25" y="12" width="110" height="56" strokeWidth="1" />
        <line x1="80" y1="12" x2="80" y2="68" strokeWidth="0.8" className="opacity-70" />
        {/* Editorial Columns */}
        <line x1="33" y1="22" x2="50" y2="22" strokeWidth="1" />
        <line x1="33" y1="28" x2="72" y2="28" strokeWidth="0.6" className="opacity-40" />
        <line x1="33" y1="33" x2="72" y2="33" strokeWidth="0.6" className="opacity-40" />
        <line x1="33" y1="38" x2="65" y2="38" strokeWidth="0.6" className="opacity-40" />
        <rect x="88" y="22" width="40" height="26" strokeWidth="0.8" className="opacity-50" />
        {/* Crop / Trim Marks */}
        <path d="M 20 12 L 25 12 M 25 7 L 25 12" strokeWidth="0.8" />
        <path d="M 135 12 L 140 12 M 135 7 L 135 12" strokeWidth="0.8" />
        <path d="M 20 68 L 25 68 M 25 68 L 25 73" strokeWidth="0.8" />
        <path d="M 135 68 L 140 68 M 135 68 L 135 73" strokeWidth="0.8" />
      </svg>
      <div className="font-mono text-[9px] text-muted/60 space-y-1 text-right">
        <div className="text-foreground/80 font-semibold uppercase">PRINT & CMYK MASTER</div>
        <div>BLEED: 3MM FULL BLEED</div>
        <div>RESOLUTION: 300 DPI</div>
      </div>
    </div>
  );
}

export function WorkUniverse({ categories }: WorkUniverseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="relative z-[40] mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-[40] max-w-3xl space-y-4 mb-14 lg:mb-20">
          <FrameCounter index="02" label="DESIGN DISCIPLINES" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Core Design Disciplines.
          </h2>
          <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
            Specialized visual design solutions—translating systematic branding rigor, packaging dielines, and typographic precision across digital and physical touchpoints.
          </p>
        </div>

        {/* 4 Major Disciplines (Bento Grid with Spec Badges) */}
        <div className="relative z-[40] grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const visual =
              DISCIPLINE_VISUALS[cat.slug] || {
                subtitle: "Design & Production",
                description: cat.description || "Tailored visual deliverables for studios and brands.",
                tag: `0${index + 1} // ${cat.name.toUpperCase()}`,
                specs: ["SYSTEM DESIGN", "PRODUCTION ASSETS"],
              };

            return (
              <Link
                key={cat.slug}
                href={`/work/${cat.slug}`}
                className="group relative flex flex-col justify-between min-h-[360px] rounded border border-line bg-surface p-7 sm:p-9 transition-all duration-300 hover:border-white/40 hover:bg-[#131317] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 overflow-hidden"
              >
                {/* Top Meta Bar */}
                <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-muted uppercase border-b border-line/40 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="signal-dot" />
                    <span className="text-foreground/85 font-semibold">{visual.tag}</span>
                  </div>
                  <span className="text-muted/60">DISCIPLINE 0{index + 1}</span>
                </div>

                {/* Visual Spec Badge Graphic */}
                <div className="my-5">
                  <DisciplineSpecBadge slug={cat.slug} />
                </div>

                {/* Center Content */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-white">
                    {cat.name}
                  </h3>
                  <p className="font-mono text-xs text-muted/90 uppercase tracking-wider font-semibold">
                    {visual.subtitle}
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-muted pt-1">
                    {visual.description}
                  </p>
                </div>

                {/* Bottom Action Footer & Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/40 pt-4 font-mono text-xs text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {visual.specs.map((spec) => (
                      <span
                        key={spec}
                        className="rounded border border-line/60 bg-[#0E0E11] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-muted/70"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-[#161619] text-muted transition-all duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight size={12} weight="bold" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

