"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FrameCounter } from "@/components/frame/FrameCounter";
import type { ICategory } from "@/database";

interface WorkUniverseProps {
  categories: ICategory[];
}

const DISCIPLINE_VISUALS: Record<
  string,
  {
    subtitle: string;
    description: string;
    tag: string;
  }
> = {
  branding: {
    subtitle: "Identity / Systems / Visual Language",
    description:
      "Precision vector systems, mathematical alignment grids, responsive logo marks, and scalable visual languages.",
    tag: "WORLD // 01",
  },
  packaging: {
    subtitle: "Objects / Surfaces / Product Presentation",
    description:
      "Physical box dielines, layered surface finishes, tactile label composition, and high-impact retail presence.",
    tag: "WORLD // 02",
  },
  "social-media": {
    subtitle: "Campaigns / Motion / Digital Communication",
    description:
      "High-cadence vertical formats, dynamic broadcast motion, typographic pacing, and multi-channel digital campaigns.",
    tag: "WORLD // 03",
  },
  "print-design": {
    subtitle: "Editorial / Typography / Physical Composition",
    description:
      "Publication layouts, physical print registration marks, bespoke typography hierarchies, and tactile editorial spreads.",
    tag: "WORLD // 04",
  },
};

export function WorkUniverse({ categories }: WorkUniverseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="relative z-[40] mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-[40] max-w-3xl space-y-4 mb-14 lg:mb-20">
          <FrameCounter index={2} total={7} label="WORK UNIVERSE" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Four Visual Worlds.
          </h2>
          <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
            The studio operates across four specialized disciplines—translating
            systematic design rigor and frame-accurate precision across digital
            and physical touchpoints.
          </p>
        </div>

        {/* 4 Major Visual Worlds (Bento Grid) */}
        <div className="relative z-[40] grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const visual =
              DISCIPLINE_VISUALS[cat.slug] || {
                subtitle: "Design & Production",
                description: cat.description || "Tailored visual deliverables for studios and brands.",
                tag: `WORLD // 0${index + 1}`,
              };

            return (
              <Link
                key={cat.slug}
                href={`/work/${cat.slug}`}
                className="group relative flex flex-col justify-between min-h-[300px] rounded border border-line bg-surface p-8 sm:p-10 transition-all duration-300 hover:border-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 overflow-hidden"
              >
                {/* 4 Corner Markers */}
                <span className="frame-corner-tl" aria-hidden="true" />
                <span className="frame-corner-tr" aria-hidden="true" />
                <span className="frame-corner-bl" aria-hidden="true" />
                <span className="frame-corner-br" aria-hidden="true" />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between font-mono text-[9px] tracking-widest text-muted uppercase border-b border-line/40 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="signal-dot" />
                    <span className="text-foreground/75 font-semibold">{visual.tag}</span>
                  </div>
                  <span className="text-muted/60">DISCIPLINE 0{index + 1}</span>
                </div>

                {/* Center Content */}
                <div className="my-6 space-y-2.5">
                  <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-white">
                    {cat.name}
                  </h3>
                  <p className="font-mono text-xs text-muted/90 uppercase tracking-wider font-semibold">
                    {visual.subtitle}
                  </p>
                  <p className="font-sans text-sm sm:text-base leading-relaxed text-muted pt-1">
                    {visual.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between border-t border-line/40 pt-4 font-mono text-xs text-muted">
                  <span className="uppercase tracking-widest text-[10px] group-hover:text-foreground transition-colors">
                    EXPLORE {cat.name} PLATES
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded border border-line bg-[#161619] text-muted transition-all duration-300 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
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
