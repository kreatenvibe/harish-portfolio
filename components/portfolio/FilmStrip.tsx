"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { ProjectMatteCard } from "./ProjectMatteCard";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { prefersReducedMotion } from "@/lib/motion";
import type { IProject } from "@/database";

interface FilmStripProps {
  projects: IProject[];
  categorySlugMap: Record<string, string>;
}

export function FilmStrip({ projects, categorySlugMap }: FilmStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isReduced = prefersReducedMotion();
    if (isReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop (> 1024px): Pinned Horizontal Film Strip Timeline
      mm.add("(min-width: 1024px)", () => {
        if (!sectionRef.current || !stageRef.current || !trackRef.current) return;

        const stage = stageRef.current;
        const track = trackRef.current;

        const getTravelDistance = () => {
          if (!track || !stage) return 0;
          return Math.max(0, track.scrollWidth - stage.clientWidth + 80);
        };

        const cardImages = track.querySelectorAll<HTMLElement>("[data-card-image]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: stage,
            start: "top top",
            end: () => `+=${Math.max(getTravelDistance() * 1.1, window.innerHeight * 1.2)}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Horizontal timeline travel
        tl.to(
          track,
          {
            x: () => -getTravelDistance(),
            ease: "none",
          },
          0
        );

        // Subtle opposing internal plate parallax
        if (cardImages.length > 0) {
          tl.fromTo(
            cardImages,
            { xPercent: -5 },
            {
              xPercent: 5,
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
      id="selected-work"
      ref={sectionRef}
      className="relative bg-[#0A0A0B] border-b border-line overflow-hidden"
    >
      {/* Pinned Stage Container on Desktop */}
      <div
        ref={stageRef}
        className="w-full flex flex-col justify-between py-16 lg:py-20 lg:h-[100dvh]"
      >
        {/* Header Strip */}
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-line/40 pb-6">
            <div className="space-y-3">
              <FrameCounter index={1} total={7} label="SELECTED WORK" />
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
                Film Strip Showcase.
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <p className="hidden md:block font-mono text-[10px] text-muted/60 uppercase tracking-wider">
                SCROLL TO SCAN PLATES
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded border border-line bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
              >
                <span>ALL WORK ARCHIVE</span>
                <ArrowUpRight size={12} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal Track */}
        <div className="hidden lg:block w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-8 px-8 w-max will-change-transform"
          >
            {projects.map((project, index) => {
              const categorySlug =
                categorySlugMap[String(project.categoryId)] || undefined;

              return (
                <div
                  key={String(project._id)}
                  className="w-[420px] xl:w-[480px] shrink-0"
                >
                  <ProjectMatteCard
                    project={project}
                    index={index}
                    categorySlug={categorySlug}
                  />
                </div>
              );
            })}

            {/* End Cap Timeline Anchor */}
            <div className="flex flex-col items-center justify-center w-[300px] shrink-0 rounded border border-dashed border-line/60 bg-[#121215] p-8 text-center space-y-4">
              <span className="font-mono text-[10px] text-muted/60 uppercase tracking-widest">
                END OF FEATURED PLATES
              </span>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded border border-line bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <span>OPEN ARCHIVE</span>
                <ArrowRight size={13} weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet: Stacked Grid */}
        <div className="lg:hidden mx-auto w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => {
              const categorySlug =
                categorySlugMap[String(project.categoryId)] || undefined;

              return (
                <ProjectMatteCard
                  key={String(project._id)}
                  project={project}
                  index={index}
                  categorySlug={categorySlug}
                />
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded border border-line bg-surface px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:border-white/40"
            >
              <span>VIEW FULL PORTFOLIO ARCHIVE</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Footer Meta Strip for Desktop Stage */}
        <div className="hidden lg:flex mx-auto w-full max-w-7xl px-8 items-center justify-between border-t border-line/40 pt-4 font-mono text-[9px] text-muted/40 uppercase tracking-widest">
          <span>PLATE COUNT: {projects.length} FRAMES</span>
          <span>COMPOSITING TIMELINE</span>
        </div>
      </div>
    </section>
  );
}
