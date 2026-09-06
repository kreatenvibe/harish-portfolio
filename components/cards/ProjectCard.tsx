"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGGER, DURATION_SECTION, prefersReducedMotion } from "@/lib/motion";
import type { IProject } from "@/database";

export default function ProjectCard({
  project,
  index,
  categorySlug,
}: {
  project: IProject;
  index: number;
  categorySlug?: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const targetHref = categorySlug
    ? `/work/${categorySlug}/${project.slug}`
    : `/work/${project.slug}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const card = cardRef.current;
    const text = textRef.current;
    if (!card || !text) return;

    const isReduced = prefersReducedMotion();
    if (isReduced) return;

    // Two-beat timing: Card wipe completes at ~DURATION_SECTION + (index * STAGGER).
    // Text fades in ~0.1s after card wipe finishes.
    const textDelay = (index * STAGGER) + (DURATION_SECTION * 0.65);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        text,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: textDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link
      ref={cardRef}
      data-project-card
      href={targetHref}
      className="group block w-full transition-all duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-[var(--radius-card)]"
    >
      {/* 1. Image Frame (Elevation communicates boundary; shadow only, no outline; 12px radius) */}
      <div className="relative aspect-4/3 w-full md:aspect-video overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-card-resting transition-shadow duration-300 ease-out group-hover:shadow-card-hover">
        {project.coverImage?.url ? (
          <Image
            src={project.coverImage.url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface">
            <span className="font-heading text-2xl font-bold text-accent/50 uppercase tracking-widest">
              {project.title}
            </span>
          </div>
        )}

        {/* Number Badge (Subtle surface badge with elevation, no outline) */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="font-mono text-xs font-semibold text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* 2. Text Block (Two-beat entrance: fades in ~0.1s after card settle completes) */}
      <div ref={textRef} className="mt-6 flex flex-col">
        {(project.client || project.tags?.[0]) && (
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent mb-2">
            {project.client || project.tags?.[0]}
          </p>
        )}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
            <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-hover:text-accent transition-colors">
              {project.title}
            </span>
          </h2>
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-foreground shadow-card-resting transition-all duration-300 group-hover:bg-accent group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
