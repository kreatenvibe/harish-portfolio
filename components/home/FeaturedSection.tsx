"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import ProjectCard from "@/components/cards/ProjectCard";
import { SectionLabel } from "@/components/motion/SectionLabel";
import { HoverLink } from "@/components/motion/HoverLink";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { prefersReducedMotion } from "@/lib/motion";
import type { IProject } from "@/database";

interface FeaturedSectionProps {
  projects: IProject[];
  categorySlugMap: Record<string, string>;
}

export function FeaturedSection({
  projects,
  categorySlugMap,
}: FeaturedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = prefersReducedMotion();
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop & large tablet: Pinned horizontal-scroll + opposing image parallax
      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current || !stageRef.current || !trackRef.current) return;

        const stage = stageRef.current;
        const track = trackRef.current;

        const getTravelDistance = () => {
          if (!track || !stage) return 0;
          return Math.max(0, track.scrollWidth - stage.clientWidth);
        };

        const images = track.querySelectorAll<HTMLElement>("[data-card-image]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: stage,
            start: "top top",
            // Vertical scroll distance proportional to horizontal travel
            end: () => `+=${Math.max(getTravelDistance() * 1.15, window.innerHeight * 1.3)}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Horizontal Track Translation (RIGHT -> LEFT)
        tl.to(
          track,
          {
            x: () => -getTravelDistance(),
            ease: "none",
          },
          0
        );

        // 2. Nested Opposing Image Parallax (LEFT -> RIGHT inside clipped card viewport)
        // Explicitly maintain scale: 1.25 so GSAP's transform retains ample overflow margins
        if (images.length > 0) {
          tl.fromTo(
            images,
            { xPercent: -8, scale: 1.25 },
            {
              xPercent: 8,
              scale: 1.25,
              ease: "none",
            },
            0
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  if (!projects || projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-background border-b border-line overflow-clip"
    >
      {/* ===================================================================== */}
      {/* DESKTOP PINNED HORIZONTAL STAGE (lg and above)                         */}
      {/* ===================================================================== */}
      <div
        ref={stageRef}
        data-featured-stage
        className="hidden lg:flex relative w-full h-screen max-h-215 min-h-150 flex-col justify-between pt-8 pb-6 overflow-hidden"
      >
        {/* Section Header */}
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 mb-4 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <ClipReveal direction="right" delay={0.02}>
                <SectionLabel>SELECTED WORK / 01</SectionLabel>
              </ClipReveal>
              <ClipReveal direction="right" delay={0.08}>
                <h2 className="mt-3 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Featured Client Work
                </h2>
              </ClipReveal>
            </div>
            <ClipReveal direction="left" delay={0.12}>
              <HoverLink
                href="/work"
                className="font-sans text-sm font-semibold text-foreground"
              >
                <span>View All Work</span>
                <ArrowRight weight="bold" />
              </HoverLink>
            </ClipReveal>
          </div>
        </div>

        {/* Horizontal Track Viewport (Top-aligned items for consistent baseline) */}
        <div className="relative w-full flex-1 flex items-start pt-2 overflow-hidden">
          <div
            ref={trackRef}
            data-featured-track
            className="flex flex-nowrap items-start gap-8 lg:gap-10 pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-16 lg:pr-24 will-change-transform"
          >
            {projects.map((project, index) => (
              <div
                key={String(project._id)}
                className="w-90 lg:w-110 xl:w-120 shrink-0 flex flex-col justify-start"
              >
                <ProjectCard
                  project={project}
                  index={index}
                  categorySlug={categorySlugMap[String(project.categoryId)]}
                  animateEntrance={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom subtle track indicator hint */}
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 pt-3 shrink-0 flex items-center justify-between text-xs font-mono text-muted">
          <span>01 / {String(projects.length).padStart(2, "0")} PROJECTS</span>
          <span className="flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <ArrowRight weight="bold" className="text-accent" />
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE / TABLET NATIVE SWIPE LAYOUT (< lg)                           */}
      {/* ===================================================================== */}
      <div className="lg:hidden py-16 px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <ClipReveal direction="right" delay={0.02}>
              <SectionLabel>SELECTED WORK / 01</SectionLabel>
            </ClipReveal>
            <ClipReveal direction="right" delay={0.08}>
              <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold leading-tight text-foreground">
                Featured Client Work
              </h2>
            </ClipReveal>
          </div>
          <ClipReveal direction="left" delay={0.12}>
            <HoverLink
              href="/work"
              className="font-sans text-sm font-semibold text-foreground"
            >
              <span>View All Work</span>
              <ArrowRight weight="bold" />
            </HoverLink>
          </ClipReveal>
        </div>

        {/* Native Horizontal Swipe / Snap Cards on Mobile */}
        <div className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-6 px-6 pb-4">
          {projects.map((project, index) => (
            <div
              key={String(project._id)}
              className="w-[85vw] max-w-95 shrink-0 snap-start"
            >
              <ProjectCard
                project={project}
                index={index}
                categorySlug={categorySlugMap[String(project.categoryId)]}
                animateEntrance={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
