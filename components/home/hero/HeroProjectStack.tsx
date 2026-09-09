"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { getImageKitUrl } from "@/lib/imagekit";
import type { IProject } from "@/database";

interface HeroProjectStackProps {
  projects: IProject[];
  categorySlugMap?: Record<string, string>;
}

export function HeroProjectStack({
  projects = [],
  categorySlugMap = {},
}: HeroProjectStackProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isStackHovered, setIsStackHovered] = useState(false);

  // Helper to resolve category slug for any project
  const getProjectCatSlug = (p: IProject): string => {
    return (
      (p.categoryId as any)?.slug ||
      categorySlugMap[String(p.categoryId)] ||
      "branding"
    );
  };

  // 1. Select representative real projects with valid coverImages across categories
  const brandingProject = projects.find((p) => {
    if (!p.coverImage?.url) return false;
    const cat = getProjectCatSlug(p);
    return cat === "branding" || p.tags?.some((t) => /brand|logo/i.test(t));
  });

  const socialProject = projects.find((p) => {
    if (!p.coverImage?.url || p._id === brandingProject?._id) return false;
    const cat = getProjectCatSlug(p);
    return (
      cat === "social-media" ||
      p.tags?.some((t) => /social|poster|youtube|movie/i.test(t))
    );
  });

  const printProject = projects.find((p) => {
    if (
      !p.coverImage?.url ||
      p._id === brandingProject?._id ||
      p._id === socialProject?._id
    )
      return false;
    const cat = getProjectCatSlug(p);
    return (
      cat === "print-materials" ||
      p.tags?.some((t) => /print|card|banner|menu|letterhead/i.test(t))
    );
  });

  const available = projects.filter((p) => p.coverImage?.url);

  // Build 3 distinct cards (or fallback gracefully to available projects)
  const stack = [
    brandingProject || available[0],
    socialProject ||
      available.find((p) => p._id !== (brandingProject || available[0])?._id) ||
      available[1] ||
      available[0],
    printProject ||
      available.find(
        (p) =>
          p._id !== (brandingProject || available[0])?._id &&
          p._id !== (socialProject || available[1])?._id
      ) ||
      available[2] ||
      available[0],
  ].filter(Boolean) as IProject[];

  if (stack.length === 0) return null;

  // Stack styling configurations:
  // Card 0: Front Primary (Branding)
  // Card 1: Middle Left (Social Media)
  // Card 2: Back Right (Print Materials)
  const cardConfigs = [
    {
      label: "BRANDING",
      frameNum: "01",
      defaultTransform: "rotate-[-1deg] translate-x-0 translate-y-0 scale-100",
      fannedTransform: "rotate-[-2deg] -translate-x-2 -translate-y-2 scale-100",
      hoverTransform: "rotate-0 translate-x-0 -translate-y-4 scale-[1.03]",
      zIndex: 30,
    },
    {
      label: "SOCIAL MEDIA",
      frameNum: "02",
      defaultTransform:
        "rotate-[-4.5deg] -translate-x-7 -translate-y-5 scale-[0.95]",
      fannedTransform:
        "rotate-[-7deg] -translate-x-12 -translate-y-7 scale-[0.97]",
      hoverTransform:
        "rotate-[-2deg] -translate-x-8 -translate-y-8 scale-[1.02]",
      zIndex: 20,
    },
    {
      label: "PRINT DESIGN",
      frameNum: "03",
      defaultTransform:
        "rotate-[5.5deg] translate-x-7 translate-y-5 scale-[0.93]",
      fannedTransform:
        "rotate-[8.5deg] translate-x-12 translate-y-8 scale-[0.96]",
      hoverTransform: "rotate-[3deg] translate-x-8 translate-y-2 scale-[1.02]",
      zIndex: 10,
    },
  ];

  return (
    <div
      className="relative w-full flex flex-col items-center lg:items-end justify-center py-6"
      onPointerEnter={() => setIsStackHovered(true)}
      onPointerLeave={() => {
        setIsStackHovered(false);
        setHoveredIdx(null);
      }}
    >
      {/* DESKTOP / TABLET FANNED STAGE */}
      <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] h-[340px] sm:h-[390px] lg:h-[430px] flex items-center justify-center">
        {stack.map((project, idx) => {
          const config = cardConfigs[idx] || cardConfigs[0];
          const isDirectlyHovered = hoveredIdx === idx;
          const catSlug = getProjectCatSlug(project);

          const href = `/work/${catSlug}/${project.slug}`;

          const transformClass = isDirectlyHovered
            ? config.hoverTransform
            : isStackHovered
              ? config.fannedTransform
              : config.defaultTransform;

          const zIndex = isDirectlyHovered ? 40 : config.zIndex;

          return (
            <Link
              key={String(project._id) + idx}
              href={href}
              onPointerEnter={() => setHoveredIdx(idx)}
              onPointerLeave={() => setHoveredIdx(null)}
              style={{ zIndex }}
              className={`group absolute flex flex-col w-[86%] sm:w-[84%] aspect-16/11 rounded border bg-surface/95 overflow-hidden shadow-2xl transition-all duration-500 ease-out will-change-transform ${transformClass} ${
                isDirectlyHovered
                  ? "border-white/70 shadow-[0_24px_50px_rgba(0,0,0,0.8)]"
                  : "border-line/80 hover:border-white/40 shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
              }`}
            >
              {/* Corner Precision Ticks */}
              <span className="frame-corner-tl" aria-hidden="true" />
              <span className="frame-corner-tr" aria-hidden="true" />
              <span className="frame-corner-bl" aria-hidden="true" />
              <span className="frame-corner-br" aria-hidden="true" />

              {/* Card Header Bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-line/40 bg-surface/80 px-3.5 py-1.5 font-mono text-[9px] font-semibold tracking-widest text-muted uppercase">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-foreground">FRAME_{config.frameNum}</span>
                </div>
                <span className="text-muted/80">{config.label}</span>
              </div>

              {/* Card Artwork Image */}
              <div className="relative w-full flex-1 min-h-0 bg-[#121214] overflow-hidden">
                {project.coverImage?.url ? (
                  <Image
                    src={getImageKitUrl(project.coverImage.url, { width: 1000 })}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                    priority={idx === 0}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#151518]">
                    <span className="font-heading text-lg uppercase tracking-widest text-muted/30">
                      {project.title}
                    </span>
                  </div>
                )}

                {/* Subtle scrim */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
              </div>

              {/* Card Footer */}
              <div className="flex shrink-0 items-center justify-between border-t border-line/40 bg-surface/90 px-3.5 py-2">
                <div className="min-w-0 pr-2">
                  <p className="font-mono text-[8px] font-semibold uppercase tracking-wider text-muted truncate">
                    {project.client || "STUDIO PRODUCTION"}
                  </p>
                  <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-tight text-foreground truncate group-hover:text-white transition-colors">
                    {project.title}
                  </p>
                </div>

                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-background text-muted transition-all duration-300 group-hover:border-white/50 group-hover:bg-foreground group-hover:text-background">
                  <ArrowUpRight size={11} weight="bold" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Interactive Micro-hint */}
      <div className="relative z-30 mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted/60">
        <span className="h-1 w-1 rounded-full bg-white/40" />
        <span>INTERACTIVE PORTFOLIO STACK // CLICK TO VIEW CASE</span>
      </div>
    </div>
  );
}
