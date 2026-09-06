"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { HeroProjectCard } from "./HeroProjectCard";
import { EASE_IN, prefersReducedMotion } from "@/lib/motion";

const RESTING_ROTATIONS = {
  branding: -4.5,
  packaging: -3.5,
  social: 5.5,
  print: -3.5,
} as const;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInteractiveRef = useRef(false);
  const isHoveredRef = useRef(false);

  // QuickTo parallax setters for composition-level breathing
  const quickToRefs = useRef<{
    layerX?: (val: number) => void;
    layerY?: (val: number) => void;
    titleX?: (val: number) => void;
    titleY?: (val: number) => void;
    brandingDiffX?: (val: number) => void;
    brandingDiffY?: (val: number) => void;
    packagingDiffX?: (val: number) => void;
    packagingDiffY?: (val: number) => void;
    socialDiffX?: (val: number) => void;
    socialDiffY?: (val: number) => void;
    printDiffX?: (val: number) => void;
    printDiffY?: (val: number) => void;
  }>({});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const isReduced = prefersReducedMotion();
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      // Direct selectors for simplified DOM hierarchy (no 3-layer nesting)
      const titleEl = "[data-hero-title]";
      const projectLayerEl = "[data-hero-project-layer]";

      const cardBranding = '[data-hero-card="branding"]';
      const cardPackaging = '[data-hero-card="packaging"]';
      const cardSocial = '[data-hero-card="social"]';
      const cardPrint = '[data-hero-card="print"]';
      const allCards = [cardBranding, cardPackaging, cardSocial, cardPrint];

      const mobileCards = "[data-hero-mobile-card]";

      // Setup composition-level parallax quickTo handlers
      const elProjectLayer = containerRef.current?.querySelector<HTMLElement>(projectLayerEl);
      const elTitle = containerRef.current?.querySelector<HTMLElement>(titleEl);
      const elBranding = containerRef.current?.querySelector<HTMLElement>(cardBranding);
      const elPackaging = containerRef.current?.querySelector<HTMLElement>(cardPackaging);
      const elSocial = containerRef.current?.querySelector<HTMLElement>(cardSocial);
      const elPrint = containerRef.current?.querySelector<HTMLElement>(cardPrint);

      if (elProjectLayer && elTitle && isFinePointer && !isReduced) {
        quickToRefs.current = {
          layerX: gsap.quickTo(elProjectLayer, "x", { duration: 0.9, ease: "power2.out" }),
          layerY: gsap.quickTo(elProjectLayer, "y", { duration: 0.9, ease: "power2.out" }),
          titleX: gsap.quickTo(elTitle, "x", { duration: 1.1, ease: "power2.out" }),
          titleY: gsap.quickTo(elTitle, "y", { duration: 1.1, ease: "power2.out" }),
          // Subtle differential offsets (a few px difference between cards)
          brandingDiffX: elBranding ? gsap.quickTo(elBranding, "xPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          brandingDiffY: elBranding ? gsap.quickTo(elBranding, "yPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          packagingDiffX: elPackaging ? gsap.quickTo(elPackaging, "xPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          packagingDiffY: elPackaging ? gsap.quickTo(elPackaging, "yPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          socialDiffX: elSocial ? gsap.quickTo(elSocial, "xPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          socialDiffY: elSocial ? gsap.quickTo(elSocial, "yPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          printDiffX: elPrint ? gsap.quickTo(elPrint, "xPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
          printDiffY: elPrint ? gsap.quickTo(elPrint, "yPercent", { duration: 0.9, ease: "power2.out" }) : undefined,
        };
      }

      // =======================================================================
      // 5. REDUCED MOTION FALLBACK
      // =======================================================================
      if (isReduced) {
        gsap.set(
          [titleEl, ...allCards, mobileCards],
          { opacity: 1, x: 0, y: 0, scale: 1, filter: "none", clearProps: "filter,willChange" }
        );
        gsap.set(cardBranding, { rotation: RESTING_ROTATIONS.branding });
        gsap.set(cardPackaging, { rotation: RESTING_ROTATIONS.packaging });
        gsap.set(cardSocial, { rotation: RESTING_ROTATIONS.social });
        gsap.set(cardPrint, { rotation: RESTING_ROTATIONS.print });

        isInteractiveRef.current = true;
        return;
      }

      // =======================================================================
      // 1. ASSEMBLY TIMELINE (Entrance, plays once on load)
      // Distinct trajectory and timing per card + physical overshoot settle
      // =======================================================================
      const assemblyTl = gsap.timeline({
        onComplete: () => {
          gsap.set([titleEl, ...allCards, mobileCards], {
            clearProps: "filter,willChange",
          });
          isInteractiveRef.current = true;
        },
      });

      // Title enters distinctly and settles before/alongside cards
      assemblyTl.fromTo(
        titleEl,
        { opacity: 0, y: -40, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: EASE_IN },
        0.05
      );

      // 1. Branding: fast approach, decelerate, settle with slight overshoot
      assemblyTl.fromTo(
        cardBranding,
        {
          opacity: 0,
          x: -180,
          y: -60,
          scale: 0.92,
          rotation: -12,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: RESTING_ROTATIONS.branding,
          duration: 0.88,
          ease: "back.out(1.4)",
        },
        0.18
      );

      // 2. Packaging: enters from opposite horizontal direction, medium speed, settle
      assemblyTl.fromTo(
        cardPackaging,
        {
          opacity: 0,
          x: 200,
          y: -40,
          scale: 0.9,
          rotation: 8,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: RESTING_ROTATIONS.packaging,
          duration: 0.95,
          ease: "back.out(1.2)",
        },
        0.3
      );

      // 3. Social: enters smoothly with slight overshoot
      assemblyTl.fromTo(
        cardSocial,
        {
          opacity: 0,
          x: -140,
          y: 110,
          scale: 0.88,
          rotation: -4,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: RESTING_ROTATIONS.social,
          duration: 0.92,
          ease: "back.out(1.5)",
        },
        0.42
      );

      // 4. Print: delayed start, fast catch-up, settle
      assemblyTl.fromTo(
        cardPrint,
        {
          opacity: 0,
          x: 180,
          y: 90,
          scale: 0.88,
          rotation: 6,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: RESTING_ROTATIONS.print,
          duration: 0.78,
          ease: "back.out(1.3)",
        },
        0.52
      );

      // Mobile cards stagger reveal (< lg)
      assemblyTl.fromTo(
        mobileCards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        0.25
      );

      // =======================================================================
      // 4. SCROLL CHOREOGRAPHY (Single pinned scrubbed timeline)
      // 0–25%: Composition breathes
      // 25–55%: Cards orbit toward center
      // 55–80%: Cards converge into 2x2 grid
      // 80–100%: Flip / section transformation transition
      // =======================================================================
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (!containerRef.current || !stageRef.current) return;

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: stageRef.current,
            start: "top top",
            end: "+=100%", // 100vh pin duration for deliberate choreographic transformation
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ---------------------------------------------------------------------
        // STAGE 1: 0% -> 25% (Composition breathes, subtle distinct drifts)
        // ---------------------------------------------------------------------
        // Title moves slower than cards (parallax depth)
        scrollTl.to(
          titleEl,
          {
            y: -35,
            opacity: 0.85,
            ease: "none",
            duration: 0.25,
          },
          0
        );

        // Branding: drifts slightly up and left
        scrollTl.to(
          cardBranding,
          {
            x: -24,
            y: -16,
            rotation: -2.5,
            ease: "none",
            duration: 0.25,
          },
          0
        );

        // Packaging: drifts slightly up and right
        scrollTl.to(
          cardPackaging,
          {
            x: 20,
            y: -14,
            rotation: -1.5,
            ease: "none",
            duration: 0.25,
          },
          0
        );

        // Social: drifts slightly down and left
        scrollTl.to(
          cardSocial,
          {
            x: -18,
            y: 20,
            rotation: 3.5,
            ease: "none",
            duration: 0.25,
          },
          0
        );

        // Print: drifts slightly down and right
        scrollTl.to(
          cardPrint,
          {
            x: 22,
            y: 18,
            rotation: -1.5,
            ease: "none",
            duration: 0.25,
          },
          0
        );

        // ---------------------------------------------------------------------
        // STAGE 2: 25% -> 55% (Cards travel toward center, loosely orbiting)
        // ---------------------------------------------------------------------
        // Title recedes up and fades out
        scrollTl.to(
          titleEl,
          {
            y: -130,
            opacity: 0,
            ease: "none",
            duration: 0.3,
          },
          0.25
        );

        // Cards orbit inward toward center
        scrollTl.to(
          cardBranding,
          {
            x: 50,
            y: 45,
            rotation: -0.5,
            ease: "power1.inOut",
            duration: 0.3,
          },
          0.25
        );

        scrollTl.to(
          cardPackaging,
          {
            x: -80,
            y: 40,
            rotation: 0,
            ease: "power1.inOut",
            duration: 0.3,
          },
          0.25
        );

        scrollTl.to(
          cardSocial,
          {
            x: 75,
            y: -40,
            rotation: 1,
            ease: "power1.inOut",
            duration: 0.3,
          },
          0.25
        );

        scrollTl.to(
          cardPrint,
          {
            x: -60,
            y: -45,
            rotation: 0,
            ease: "power1.inOut",
            duration: 0.3,
          },
          0.25
        );

        // ---------------------------------------------------------------------
        // STAGE 3: 55% -> 80% (Cards converge into clean 2x2 grid)
        // ---------------------------------------------------------------------
        // Branding: Top-Left quadrant (x, y, scale normalized)
        scrollTl.to(
          cardBranding,
          {
            x: 35,
            y: 70,
            scale: 0.88,
            rotation: 0,
            ease: "power1.out",
            duration: 0.25,
          },
          0.55
        );

        // Packaging: Top-Right quadrant
        scrollTl.to(
          cardPackaging,
          {
            x: -110,
            y: 65,
            scale: 0.98,
            rotation: 0,
            ease: "power1.out",
            duration: 0.25,
          },
          0.55
        );

        // Social: Bottom-Left quadrant
        scrollTl.to(
          cardSocial,
          {
            x: 105,
            y: -50,
            scale: 1.18,
            rotation: 0,
            ease: "power1.out",
            duration: 0.25,
          },
          0.55
        );

        // Print: Bottom-Right quadrant
        scrollTl.to(
          cardPrint,
          {
            x: -85,
            y: -50,
            scale: 0.88,
            rotation: 0,
            ease: "power1.out",
            duration: 0.25,
          },
          0.55
        );

        // ---------------------------------------------------------------------
        // STAGE 4: 80% -> 100% (Flip plugin section handover)
        // ---------------------------------------------------------------------
        // Check if destination grid elements exist in the next section for Flip calculation
        const destinationCards = document.querySelectorAll<HTMLElement>("[data-project-card]");

        if (destinationCards.length >= 4) {
          // Use Flip.fit coordinate calculation for direct element alignment
          const cards = [
            containerRef.current.querySelector<HTMLElement>(cardBranding),
            containerRef.current.querySelector<HTMLElement>(cardPackaging),
            containerRef.current.querySelector<HTMLElement>(cardSocial),
            containerRef.current.querySelector<HTMLElement>(cardPrint),
          ];

          cards.forEach((cardEl, idx) => {
            if (!cardEl || !destinationCards[idx]) return;

            try {
              const fitVars = Flip.fit(cardEl, destinationCards[idx], {
                getVars: true,
                scale: true,
              }) as Record<string, any>;

              if (fitVars) {
                scrollTl.to(
                  cardEl,
                  {
                    x: fitVars.x ?? 0,
                    y: fitVars.y ?? 0,
                    scale: fitVars.scaleX ?? 1,
                    rotation: 0,
                    ease: "power1.inOut",
                    duration: 0.2,
                  },
                  0.8
                );
              }
            } catch {
              // Graceful fallback if Flip fit encounters coordinate boundary
              scrollTl.to(
                cardEl,
                {
                  y: "+=60",
                  scale: 0.82,
                  rotation: 0,
                  ease: "power1.inOut",
                  duration: 0.2,
                },
                0.8
              );
            }
          });
        } else {
          // Standard unified 2x2 grid forward sweep into next section
          scrollTl.to(
            allCards,
            {
              y: "+=50",
              scale: 0.85,
              rotation: 0,
              ease: "power1.inOut",
              duration: 0.2,
            },
            0.8
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. COMPOSITION-LEVEL PARALLAX (Pointer movement on stage)
  // Shifts the entire composition as one loosely connected group with tiny differential offsets
  // ---------------------------------------------------------------------------
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractiveRef.current || prefersReducedMotion() || isHoveredRef.current) return;
    if (e.pointerType === "touch") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Center-normalized coordinates (-1 to +1)
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    const {
      layerX,
      layerY,
      titleX,
      titleY,
      brandingDiffX,
      brandingDiffY,
      packagingDiffX,
      packagingDiffY,
      socialDiffX,
      socialDiffY,
      printDiffX,
      printDiffY,
    } = quickToRefs.current;

    // Entire composition shifts subtly together
    layerX?.(nx * 8);
    layerY?.(ny * 6);

    // Title moves slower (parallax depth)
    titleX?.(nx * 3);
    titleY?.(ny * 2);

    // Subtle differential offsets between cards (a few percent / px)
    brandingDiffX?.(nx * 1.5);
    brandingDiffY?.(ny * 1.5);
    packagingDiffX?.(nx * -1.2);
    packagingDiffY?.(ny * -1.2);
    socialDiffX?.(nx * 1.2);
    socialDiffY?.(ny * -1);
    printDiffX?.(nx * -1.5);
    printDiffY?.(ny * 1.2);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isInteractiveRef.current || prefersReducedMotion()) return;

    const {
      layerX,
      layerY,
      titleX,
      titleY,
      brandingDiffX,
      brandingDiffY,
      packagingDiffX,
      packagingDiffY,
      socialDiffX,
      socialDiffY,
      printDiffX,
      printDiffY,
    } = quickToRefs.current;

    layerX?.(0);
    layerY?.(0);
    titleX?.(0);
    titleY?.(0);
    brandingDiffX?.(0);
    brandingDiffY?.(0);
    packagingDiffX?.(0);
    packagingDiffY?.(0);
    socialDiffX?.(0);
    socialDiffY?.(0);
    printDiffX?.(0);
    printDiffY?.(0);
  }, []);

  // ---------------------------------------------------------------------------
  // 3. FOCUSED HOVER
  // Hovered card scales ~1.04, z-index elevated, non-hovered recede to opacity 0.70 (crisp, no blur)
  // ---------------------------------------------------------------------------
  const handleCardHoverStart = useCallback((activeVariant: keyof typeof RESTING_ROTATIONS) => {
    if (!isInteractiveRef.current || prefersReducedMotion()) return;
    isHoveredRef.current = true;

    const variants = ["branding", "packaging", "social", "print"] as const;
    const activeCardEl = containerRef.current?.querySelector<HTMLElement>(`[data-hero-card="${activeVariant}"]`);

    if (activeCardEl) {
      activeCardEl.style.zIndex = "30";
      gsap.to(activeCardEl, {
        scale: 1.04,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Non-hovered cards recede to opacity 0.70 (crisp, no blur)
    variants.forEach((v) => {
      if (v !== activeVariant) {
        const otherCardEl = containerRef.current?.querySelector<HTMLElement>(`[data-hero-card="${v}"]`);
        if (otherCardEl) {
          gsap.to(otherCardEl, {
            opacity: 0.70,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    });
  }, []);

  const handleCardHoverEnd = useCallback((activeVariant: keyof typeof RESTING_ROTATIONS) => {
    if (!isInteractiveRef.current || prefersReducedMotion()) return;
    isHoveredRef.current = false;

    const variants = ["branding", "packaging", "social", "print"] as const;
    const activeCardEl = containerRef.current?.querySelector<HTMLElement>(`[data-hero-card="${activeVariant}"]`);

    if (activeCardEl) {
      const defaultZ = activeVariant === "social" ? "20" : "10";
      activeCardEl.style.zIndex = defaultZ;
      gsap.to(activeCardEl, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Restore all cards to full opacity
    variants.forEach((v) => {
      if (v !== activeVariant) {
        const otherCardEl = containerRef.current?.querySelector<HTMLElement>(`[data-hero-card="${v}"]`);
        if (otherCardEl) {
          gsap.to(otherCardEl, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    });
  }, []);

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full bg-background text-foreground select-none border-b border-line flex flex-col justify-center min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] max-h-[880px] overflow-clip"
    >
      {/* ======================================================================= */}
      {/* HeroStage: "The Box" (overflow: clip, position: relative)              */}
      {/* Everything below animates freely inside it, document outside is clean   */}
      {/* ======================================================================= */}
      <div
        ref={stageRef}
        data-hero-stage
        className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-12 py-4 lg:py-6 overflow-clip"
      >
        {/* ===================================================================== */}
        {/* DESKTOP 16:9 BOUNDED STAGE COMPOSITION (lg and above)                 */}
        {/* ===================================================================== */}
        <div className="relative hidden lg:block flex-1 w-full h-full my-auto overflow-clip">
          {/* 1. Title: "SELECTED WORK" (z-40, stays above background & layer) */}
          <div
            data-hero-title
            className="absolute left-2 xl:left-4 top-[4%] xl:top-[5%] z-40 pointer-events-none opacity-0"
          >
            <h1 className="font-heading font-black text-[clamp(5rem,7.5vw,9.5rem)] xl:text-[clamp(6rem,8.5vw,10.5rem)] leading-[0.82] tracking-tighter text-foreground drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
              SELECTED
              <br />
              WORK
            </h1>
          </div>

          {/* 2. ProjectLayer (Branding, Packaging, Social, Print cards) */}
          <div
            data-hero-project-layer
            className="relative w-full h-full"
          >
            {/* 1. BRANDING (Upper Left/Center, tilted -4.5deg) */}
            <div
              data-hero-card="branding"
              className="absolute left-[18%] xl:left-[19%] top-[4%] xl:top-[5%] z-10 w-[34%] max-w-[460px] opacity-0 will-change-transform"
            >
              <HeroProjectCard
                number="01"
                title="BRANDING"
                imageSrc="/images/hero/branding.png"
                imageAlt="Branding and visual identity project showcase"
                variant="branding"
                href="/work/branding"
                onHoverStart={() => handleCardHoverStart("branding")}
                onHoverEnd={() => handleCardHoverEnd("branding")}
              />
            </div>

            {/* 2. PACKAGING (Upper Right, tilted -3.5deg) */}
            <div
              data-hero-card="packaging"
              className="absolute right-[8%] xl:right-[10%] top-[6%] xl:top-[7%] z-10 w-[26%] max-w-[350px] opacity-0 will-change-transform"
            >
              <HeroProjectCard
                number="02"
                title="PACKAGING"
                imageSrc="/images/hero/packaging.png"
                imageAlt="Packaging and label design project showcase"
                variant="packaging"
                href="/work/packaging"
                onHoverStart={() => handleCardHoverStart("packaging")}
                onHoverEnd={() => handleCardHoverEnd("packaging")}
              />
            </div>

            {/* 3. SOCIAL MEDIA (Lower Left, tilted +5.5deg) */}
            <div
              data-hero-card="social"
              className="absolute left-[8%] xl:left-[9%] bottom-[5%] xl:bottom-[6%] z-20 w-[21%] max-w-[280px] opacity-0 will-change-transform"
            >
              <HeroProjectCard
                number="03"
                title="SOCIAL MEDIA"
                imageSrc="/images/hero/social-media.png"
                imageAlt="Social media campaign and creative assets showcase"
                variant="social"
                href="/work/social-media"
                onHoverStart={() => handleCardHoverStart("social")}
                onHoverEnd={() => handleCardHoverEnd("social")}
              />
            </div>

            {/* 4. PRINT DESIGN (Lower Right, tilted -3.5deg) */}
            <div
              data-hero-card="print"
              className="absolute right-[10%] xl:right-[12%] bottom-[3%] xl:bottom-[4%] z-10 w-[34%] max-w-[450px] opacity-0 will-change-transform"
            >
              <HeroProjectCard
                number="04"
                title="PRINT DESIGN"
                imageSrc="/images/hero/print-design.png"
                imageAlt="Print design and editorial layout project showcase"
                variant="print"
                href="/work/print-design"
                onHoverStart={() => handleCardHoverStart("print")}
                onHoverEnd={() => handleCardHoverEnd("print")}
              />
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MOBILE & TABLET RESPONSIVE ARRANGEMENT (< lg)                         */}
        {/* ===================================================================== */}
        <div className="lg:hidden flex flex-col gap-6 py-6">
          {/* Main Title */}
          <div data-hero-title className="opacity-0">
            <h1 className="font-heading font-black text-6xl sm:text-7xl md:text-8xl leading-[0.85] tracking-tighter text-foreground">
              SELECTED
              <br />
              WORK
            </h1>
          </div>

          {/* Cards Staggered Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
            <div data-hero-mobile-card className="sm:-rotate-2 opacity-0">
              <HeroProjectCard
                number="01"
                title="BRANDING"
                imageSrc="/images/hero/branding.png"
                imageAlt="Branding and visual identity project showcase"
                variant="branding"
                href="/work/branding"
              />
            </div>

            <div data-hero-mobile-card className="sm:rotate-2 sm:mt-4 opacity-0">
              <HeroProjectCard
                number="02"
                title="PACKAGING"
                imageSrc="/images/hero/packaging.png"
                imageAlt="Packaging and label design project showcase"
                variant="packaging"
                href="/work/packaging"
              />
            </div>

            <div data-hero-mobile-card className="sm:rotate-3 opacity-0">
              <HeroProjectCard
                number="03"
                title="SOCIAL MEDIA"
                imageSrc="/images/hero/social-media.png"
                imageAlt="Social media campaign and creative assets showcase"
                variant="social"
                href="/work/social-media"
              />
            </div>

            <div data-hero-mobile-card className="sm:-rotate-2 sm:mt-4 opacity-0">
              <HeroProjectCard
                number="04"
                title="PRINT DESIGN"
                imageSrc="/images/hero/print-design.png"
                imageAlt="Print design and editorial layout project showcase"
                variant="print"
                href="/work/print-design"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
