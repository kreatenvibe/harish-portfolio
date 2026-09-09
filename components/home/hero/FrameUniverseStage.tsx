"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { HeroProjectStack } from "./HeroProjectStack";
import { prefersReducedMotion } from "@/lib/motion";
import type { IProject } from "@/database";

interface FrameUniverseStageProps {
  projects?: IProject[];
  categorySlugMap?: Record<string, string>;
}

// DETERMINISTIC HERO STACKING LAYER SYSTEM:
// --hero-bg: 10       (Hero background frame, shell, corner brackets)
// --hero-artwork: 20  (Portfolio artwork plates & fanned stack)
// --hero-content: 40  (Hero typography HK DESIGNS & narrative)
// --hero-controls: 50 (Interactive CTA buttons — guaranteed clickability)
// --hero-hud: 60      (Top metadata header & tracking markers)

export function FrameUniverseStage({
  projects = [],
  categorySlugMap = {},
}: FrameUniverseStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const darknessOverlayRef = useRef<HTMLDivElement>(null);
  const cinematicBarRef = useRef<HTMLDivElement>(null);
  const frameBorderRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (isReduced) {
        gsap.set([darknessOverlayRef.current, cinematicBarRef.current], { display: "none" });
        gsap.set(
          [
            frameBorderRef.current,
            typographyRef.current,
            stackRef.current,
            trackingRef.current,
            metaRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, clearProps: "transform,clipPath" }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state
      gsap.set(darknessOverlayRef.current, { opacity: 1 });
      gsap.set(cinematicBarRef.current, { scaleX: 0, opacity: 1 });
      gsap.set(frameBorderRef.current, { opacity: 0, scale: 0.99 });
      gsap.set(typographyRef.current?.children ? Array.from(typographyRef.current.children) : [], {
        opacity: 0,
        y: 20,
      });
      gsap.set(stackRef.current, { opacity: 0, y: 24, scale: 0.96 });
      gsap.set(trackingRef.current, { opacity: 0 });
      gsap.set(metaRef.current, { opacity: 0, y: -8 });

      // 1. Cinematic Bar draws across screen
      tl.to(cinematicBarRef.current, {
        scaleX: 1,
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.1,
      })
        // 2. Stage Frame shell reveals and clears inline properties to prevent stacking context trapping
        .to(
          frameBorderRef.current,
          {
            opacity: 1,
            duration: 0.8,
            ease: "power3.inOut",
            clearProps: "all",
          },
          "-=0.2"
        )
        // 3. Darkness overlay fades out
        .to(
          darknessOverlayRef.current,
          {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              if (darknessOverlayRef.current) {
                darknessOverlayRef.current.style.display = "none";
              }
            },
          },
          "-=0.6"
        )
        .to(cinematicBarRef.current, { opacity: 0, duration: 0.25 }, "-=0.6")
        // 4. Metadata & HUD appear (Z-INDEX 60)
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.4, clearProps: "transform" }, "-=0.3")
        .to(trackingRef.current, { opacity: 1, duration: 0.4, clearProps: "transform" }, "-=0.3")
        // 5. Typography appears (Z-INDEX 40 & 50)
        .to(
          typographyRef.current?.children ? Array.from(typographyRef.current.children) : [],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            clearProps: "transform",
          },
          "-=0.2"
        )
        // 6. Portfolio Stack reveals smoothly
        .to(
          stackRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "opacity,y,scale",
          },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92dvh] w-full flex items-center justify-center bg-[#0A0A0B] px-4 py-8 sm:px-6 lg:px-8 border-b border-line overflow-hidden"
    >
      {/* 1. Cinematic Opening Layer (Top Overlay) */}
      <div
        ref={darknessOverlayRef}
        className="absolute inset-0 z-[100] bg-[#0A0A0B] pointer-events-auto flex items-center justify-center"
      >
        <div
          ref={cinematicBarRef}
          className="h-[1px] w-full max-w-4xl bg-white/40 origin-center"
        />
      </div>

      {/* Main Cinematic Frame Shell */}
      <div
        ref={frameBorderRef}
        className="relative w-full max-w-7xl min-h-[78vh] rounded border border-line bg-[#121214] p-6 sm:p-10 lg:p-14 flex flex-col justify-between shadow-2xl overflow-hidden"
      >
        {/* Precision Corner Ticks (Z-INDEX 10) */}
        <span className="frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner-tr" aria-hidden="true" />
        <span className="frame-corner-bl" aria-hidden="true" />
        <span className="frame-corner-br" aria-hidden="true" />

        {/* Minimal Tracking Points (Z-INDEX 60: HUD) */}
        <div ref={trackingRef} className="pointer-events-none absolute inset-0 z-[60]">
          <TrackingPoint className="top-6 left-6" variant="bracket" />
          <TrackingPoint className="top-6 right-6" variant="bracket" />
          <TrackingPoint className="bottom-6 left-6" variant="cross" />
          <TrackingPoint className="bottom-6 right-6" variant="target" />
        </div>

        {/* Top Minimal Frame Header (Z-INDEX 60: HUD) */}
        <div
          ref={metaRef}
          className="relative z-[60] flex items-center justify-between border-b border-line/40 pb-4 font-mono text-[10px] tracking-widest text-muted uppercase"
        >
          <div className="flex items-center gap-2">
            <span className="signal-dot" />
            <span className="text-foreground font-semibold">FRAME 000 {"//"} COMPOSITING STAGE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-muted/60">
            <span>ETV NETWORK</span>
            <span>HYDERABAD, IN</span>
          </div>
        </div>

        {/* Center Stage: Split Composition Grid */}
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center my-auto py-8">
          {/* Left Column: Authentic HK Designs Typography (Z-INDEX 40: CONTENT & Z-INDEX 50: CONTROLS) */}
          <div ref={typographyRef} className="relative z-[40] space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              <span className="text-foreground">HARISH KUMAR G</span>
              <span className="text-line">•</span>
              <span>ETV NETWORK</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] tracking-tight text-foreground">
                HK DESIGNS
              </h1>
              <p className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-muted tracking-tight">
                Graphic Designer
              </p>
            </div>

            <p className="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-muted">
              Graphic Designer with experience across branding, posters and print design, product packaging, digital and social media, and broadcast graphics—currently designing at ETV Network.
            </p>

            {/* CTAs (Z-INDEX 50: INTERACTIVE CONTROLS) */}
            <div className="relative z-[50] flex flex-wrap items-center gap-4 pt-2 pointer-events-auto">
              <Link
                href="#selected-work"
                className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <span>EXPLORE WORK</span>
                <ArrowDown size={13} weight="bold" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded border border-line bg-surface px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-white/40 hover:bg-white/5"
              >
                <span>START PROJECT</span>
                <ArrowUpRight size={13} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Right Column: Fanned / Stacked Portfolio Image Composition */}
          <div ref={stackRef} className="relative z-[40] w-full flex items-center justify-center lg:justify-end">
            <HeroProjectStack
              projects={projects}
              categorySlugMap={categorySlugMap}
            />
          </div>
        </div>

        {/* Bottom Sequence Guide (Z-INDEX 60: HUD) */}
        <div className="relative z-[60] flex items-center justify-between border-t border-line/40 pt-4 font-mono text-[10px] tracking-widest text-muted/60 uppercase">
          <span>TIMELINE PROGRESSION ───→</span>
          <div className="flex items-center gap-2">
            <span>SCROLL TO ADVANCE</span>
            <ArrowDown size={11} />
          </div>
        </div>
      </div>
    </section>
  );
}

