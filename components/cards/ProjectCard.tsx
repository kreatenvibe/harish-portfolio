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
  animateEntrance = true,
  className = "",
}: {
  project: IProject;
  index: number;
  categorySlug?: string;
  animateEntrance?: boolean;
  className?: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const targetHref = categorySlug
    ? `/work/${categorySlug}/${project.slug}`
    : `/work/${project.slug}`;

  useEffect(() => {
    if (!animateEntrance) return;

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
  }, [index, animateEntrance]);

  return (
    <Link
      ref={cardRef}
      data-project-card
      href={targetHref}
      className={`group block w-full transition-all duration-300 ease-out hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-card ${className}`}
    >
      {/* 1. Image Frame (Consistent aspect-16/10 and 12px rounded-xl border radius) */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-surface border border-black/10 dark:border-white/10 shadow-card-resting transition-shadow duration-300 ease-out group-hover:shadow-card-hover">
        {project.coverImage?.url ? (
          <div className="relative h-full w-full overflow-hidden" data-card-media>
            <Image
              src={project.coverImage.url}
              alt={project.title}
              fill
              data-card-image
              className="object-cover scale-[1.25] will-change-transform transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-surface">
            <span className="font-heading text-2xl font-bold text-accent/50 uppercase tracking-widest">
              {project.title}
            </span>
          </div>
        )}

        {/* Number Badge (Clean uniform top-right pill) */}
        <div className="absolute top-3.5 right-3.5 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10">
          <span className="font-mono text-xs font-semibold text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* 2. Text Block (Uniform top baseline and line-clamped title for consistent height) */}
      <div ref={textRef} className="mt-4 flex flex-col justify-start">
        {(project.client || project.tags?.[0]) && (
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent mb-1.5 line-clamp-1">
            {project.client || project.tags?.[0]}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight line-clamp-2">
            <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-hover:text-accent transition-colors">
              {project.title}
            </span>
          </h2>
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-foreground shadow-card-resting transition-all duration-300 group-hover:bg-accent group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
