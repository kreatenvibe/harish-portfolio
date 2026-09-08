"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { prefersReducedMotion } from "@/lib/motion";
import type { IProject } from "@/database";

interface FrameUniverseStageProps {
  projects?: IProject[];
}

export function FrameUniverseStage({ projects = [] }: FrameUniverseStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const darknessOverlayRef = useRef<HTMLDivElement>(null);
  const cinematicBarRef = useRef<HTMLDivElement>(null);
  const frameBorderRef = useRef<HTMLDivElement>(null);
  const heroPlateRef = useRef<HTMLDivElement>(null);
  const secondaryPlateRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const primaryProject = projects[0];
  const secondaryProject = projects[1];

  useEffect(() => {
    const isReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (isReduced) {
        gsap.set(
          [
            darknessOverlayRef.current,
            cinematicBarRef.current,
          ],
          { display: "none" }
        );
        gsap.set(
          [
            frameBorderRef.current,
            heroPlateRef.current,
            secondaryPlateRef.current,
            typographyRef.current,
            trackingRef.current,
            metaRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial state: Absolute Darkness & Centered Cinematic Shutter Bar
      gsap.set(darknessOverlayRef.current, { opacity: 1 });
      gsap.set(cinematicBarRef.current, { scaleX: 0, opacity: 1 });
      gsap.set(frameBorderRef.current, {
        opacity: 0,
        clipPath: "inset(50% 0% 50% 0%)",
        scale: 0.98,
      });
      gsap.set(heroPlateRef.current, { opacity: 0, scale: 1.05, y: 15 });
      gsap.set(secondaryPlateRef.current, { opacity: 0, scale: 1.03, x: 15 });
      gsap.set(typographyRef.current?.children ? Array.from(typographyRef.current.children) : [], {
        opacity: 0,
        y: 20,
      });
      gsap.set(trackingRef.current, { opacity: 0 });
      gsap.set(metaRef.current, { opacity: 0, y: -8 });

      // 1. Cinematic Bar draws across screen from darkness
      tl.to(cinematicBarRef.current, {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.1,
      })
        // 2. Bar expands vertically into the frame reveal
        .to(
          frameBorderRef.current,
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.1,
            ease: "power3.inOut",
          },
          "-=0.2"
        )
        // 3. Darkness overlay fades out seamlessly
        .to(
          darknessOverlayRef.current,
          {
            opacity: 0,
            duration: 0.6,
            onComplete: () => {
              if (darknessOverlayRef.current) {
                darknessOverlayRef.current.style.pointerEvents = "none";
              }
            },
          },
          "-=0.7"
        )
        .to(cinematicBarRef.current, { opacity: 0, duration: 0.3 }, "-=0.7")
        // 4. Subtle framing marks and header metadata appear
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
        .to(trackingRef.current, { opacity: 1, duration: 0.5 }, "-=0.3")
        // 5. Real portfolio artwork plates reveal with spatial depth
        .to(heroPlateRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.9 }, "-=0.3")
        .to(secondaryPlateRef.current, { opacity: 0.7, scale: 1, x: 0, duration: 0.8 }, "-=0.6")
        // 6. Typography appears
        .to(
          typographyRef.current?.children ? Array.from(typographyRef.current.children) : [],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92dvh] w-full flex items-center justify-center bg-[#0A0A0B] px-4 py-8 sm:px-6 lg:px-8 overflow-hidden border-b border-line"
    >
      {/* 1. Absolute Darkness Cinematic Opening Layer */}
      <div
        ref={darknessOverlayRef}
        className="absolute inset-0 z-50 bg-[#0A0A0B] pointer-events-auto flex items-center justify-center"
      >
        <div
          ref={cinematicBarRef}
          className="h-[1px] w-full max-w-4xl bg-white/40 origin-center"
        />
      </div>

      {/* Main Cinematic Frame */}
      <div
        ref={frameBorderRef}
        className="relative w-full max-w-7xl min-h-[78vh] rounded border border-line bg-[#121214] p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* 4 Precision Corner Ticks */}
        <span className="frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner-tr" aria-hidden="true" />
        <span className="frame-corner-bl" aria-hidden="true" />
        <span className="frame-corner-br" aria-hidden="true" />

        {/* Minimal Tracking Points */}
        <div ref={trackingRef} className="pointer-events-none absolute inset-0 z-20">
          <TrackingPoint className="top-6 left-6" variant="bracket" />
          <TrackingPoint className="top-6 right-6" variant="bracket" />
          <TrackingPoint className="bottom-6 left-6" variant="cross" />
          <TrackingPoint className="bottom-6 right-6" variant="target" />
        </div>

        {/* Top Minimal Frame Header */}
        <div
          ref={metaRef}
          className="relative z-20 flex items-center justify-between border-b border-line/40 pb-4 font-mono text-[10px] tracking-widest text-muted uppercase"
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

        {/* Center Stage: Split Composition with Real Artwork Plates */}
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center my-auto py-8">
          {/* Left Column: Authentic HK Designs Typography */}
          <div ref={typographyRef} className="space-y-6">
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
                Visual Design × Paint &amp; Roto
              </p>
            </div>

            <p className="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-muted">
              Detail-oriented Graphic Designer and Paint &amp; Roto artist delivering brand identity systems, packaging, broadcast graphics, and frame-accurate VFX plate cleanups.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
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

          {/* Right Column: Layered Compositing Artwork Plates */}
          <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[380px]">
            {/* Secondary Background Plate */}
            <div
              ref={secondaryPlateRef}
              className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 w-[85%] aspect-16/10 rounded border border-line/60 bg-[#161619] overflow-hidden shadow-2xl transform rotate-1 pointer-events-none opacity-70"
            >
              {secondaryProject?.coverImage?.url ? (
                <Image
                  src={secondaryProject.coverImage.url}
                  alt={secondaryProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover filter brightness-90 contrast-105"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#151518] p-6 text-center">
                  <span className="font-mono text-[10px] text-muted/30 uppercase tracking-widest">
                    COMPOSITION LAYER 02
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Primary Hero Plate */}
            <div
              ref={heroPlateRef}
              className="relative z-10 w-[92%] aspect-16/10 rounded border border-line bg-[#1A1A1D] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] transform -rotate-1"
            >
              {primaryProject?.coverImage?.url ? (
                <Image
                  src={primaryProject.coverImage.url}
                  alt={primaryProject.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#18181B] p-8 text-center">
                  <span className="font-heading text-3xl font-bold uppercase text-foreground">
                    HK DESIGNS
                  </span>
                </div>
              )}

              {/* Minimal Scrim & Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {primaryProject && (
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between font-mono text-[10px] text-foreground">
                  <div>
                    <p className="font-bold text-sm uppercase font-heading">{primaryProject.title}</p>
                    <p className="text-muted text-[9px] uppercase tracking-wider">{primaryProject.client || "FEATURED PRODUCTION"}</p>
                  </div>
                  <span className="text-muted/60 text-[9px] uppercase tracking-widest">PLATE_01</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sequence Guide */}
        <div className="relative z-20 flex items-center justify-between border-t border-line/40 pt-4 font-mono text-[10px] tracking-widest text-muted/60 uppercase">
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
