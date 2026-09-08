"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { IProject } from "@/database";

interface ProjectMatteCardProps {
  project: IProject;
  index: number;
  categorySlug?: string;
  className?: string;
}

export function ProjectMatteCard({
  project,
  index,
  categorySlug,
  className = "",
}: ProjectMatteCardProps) {
  const targetHref = categorySlug
    ? `/work/${categorySlug}/${project.slug}`
    : `/work/${project.slug}`;

  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={targetHref}
      className={`group relative block w-full overflow-hidden rounded border border-line bg-surface transition-all duration-300 hover:border-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 ${className}`}
    >
      {/* 4 Precision Corner Marks */}
      <span className="frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner-tr" aria-hidden="true" />
      <span className="frame-corner-bl" aria-hidden="true" />
      <span className="frame-corner-br" aria-hidden="true" />

      {/* Frame Top Header */}
      <div className="flex items-center justify-between border-b border-line/40 px-4 py-2 font-mono text-[9px] tracking-widest text-muted uppercase">
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/50 transition-transform duration-300 group-hover:scale-150" />
          <span>FRAME_{formattedIndex}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/75 font-semibold">
          <span>{project.tags?.[0] || "VISUAL_WORK"}</span>
        </div>
      </div>

      {/* Artwork Plate */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#141416]">
        {project.coverImage?.url ? (
          <Image
            src={project.coverImage.url}
            alt={project.title}
            fill
            data-card-image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#151518]">
            <span className="font-heading text-2xl uppercase tracking-widest text-muted/30">
              {project.title}
            </span>
          </div>
        )}

        {/* Matte Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

        {/* Floating Year / Client Pill */}
        <div className="absolute top-3 right-3 rounded border border-white/10 bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-[9px] font-semibold text-muted uppercase tracking-wider">
          {project.year || project.client || "PROJECT"}
        </div>
      </div>

      {/* Frame Footer / Project Details */}
      <div className="flex items-center justify-between border-t border-line/40 p-4">
        <div className="space-y-1">
          <p className="font-mono text-[9px] font-semibold text-muted uppercase tracking-widest">
            {project.client || "STUDIO PRODUCTION"}
          </p>
          <h3 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-white">
            {project.title}
          </h3>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-line bg-[#161619] text-muted transition-all duration-300 group-hover:border-white/50 group-hover:bg-white group-hover:text-black">
          <ArrowUpRight size={13} weight="bold" />
        </div>
      </div>
    </Link>
  );
}
