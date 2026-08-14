"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORD_DURATION = 1700;
const INTRO_DURATION = 2200;

const words = ["business", "CRM", "billing", "automation"] as const;

const rotations = [
  {
    word: "CRM",
    image: "/hero/crm-card.png",
    alt: "CRM deals pipeline card showing active deals, stages, and values",
  },
  {
    word: "billing",
    image: "/hero/billing-card.png",
    alt: "Billing card showing monthly revenue trending upward",
  },
  {
    word: "automation",
    image: "/hero/automation-card.png",
    alt: "Automation activity card showing recently completed tasks",
  },
] as const;

const DELAYS = {
  eyebrow: 0.05,
  headline: 0.15,
  subhead: 0.25,
  cta: 0.35,
};

const FADE = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  }),
};

const FADE_NO_MOTION = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0, transition: { duration: 0 } }),
};

// Fanned stack positions, front to back.
const STACK_POSITIONS = [
  { scale: 1, x: 0, y: 0, rotate: 0, zIndex: 30 },
  { scale: 0.94, x: 22, y: 26, rotate: 6, zIndex: 20 },
  { scale: 0.88, x: 40, y: 48, rotate: 11, zIndex: 10 },
];

const ACTIVE_OPACITY = [1, 0.92, 0.85];
const DIMMED_OPACITY = 0.55;

export function HeroSequence() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? FADE_NO_MOTION : FADE;

  const [wordIndex, setWordIndex] = useState(0);

  // Remembers which card was last in front so the "business" (general) beat
  // dims the existing arrangement in place instead of resetting it.
  const [lastCategory, setLastCategory] = useState(0);
  const isGeneral = words[wordIndex] === "business";
  if (!isGeneral && lastCategory !== wordIndex - 1) {
    setLastCategory(wordIndex - 1);
  }
  const activeCategory = lastCategory;

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId: NodeJS.Timeout;

    const startTimer = () => {
      const duration =
        words[wordIndex] === "business" ? INTRO_DURATION : WORD_DURATION;
      timeoutId = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
      }, duration);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
      } else {
        startTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startTimer();

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [wordIndex, prefersReducedMotion]);

  const activeWord = words[wordIndex];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 lg:px-8 lg:pt-16 lg:pb-32">
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Copy */}
        <div>
          {/* Eyebrow */}
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.18em] text-accent"
            initial="hidden"
            animate="visible"
            custom={prefersReducedMotion ? 0 : DELAYS.eyebrow}
            variants={variants}
          >
            Custom Business Software
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            initial="hidden"
            animate="visible"
            custom={prefersReducedMotion ? 0 : DELAYS.headline}
            variants={variants}
          >
            Software that fits
            <br />
            your{" "}
            {prefersReducedMotion ? (
              "business."
            ) : (
              <motion.span
                layout
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative inline-flex overflow-hidden align-bottom"
                aria-hidden="true"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={activeWord}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-block whitespace-nowrap ${
                      isGeneral ? "text-foreground" : "text-accent"
                    }`}
                  >
                    {activeWord}.
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            )}
            {!prefersReducedMotion && (
              <span className="sr-only">business.</span>
            )}
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            className="mt-8 max-w-lg text-lg leading-8 text-muted sm:text-xl"
            initial="hidden"
            animate="visible"
            custom={prefersReducedMotion ? 0 : DELAYS.subhead}
            variants={variants}
          >
            We design and build custom software that fits the way your business
            actually works—from CRM systems and customer portals to billing
            platforms, internal tools, and AI automations. Every solution is
            tailored to your workflow, not the other way around.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center"
            initial="hidden"
            animate="visible"
            custom={prefersReducedMotion ? 0 : DELAYS.cta}
            variants={variants}
          >
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Start Your Project
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded px-2 py-3.5 text-sm font-semibold text-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Discuss Your Needs
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Synced card stack */}
        <motion.div
          className="relative mx-auto aspect-square w-full max-w-sm lg:mx-0 lg:max-w-md"
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : DELAYS.cta,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden="true"
        >
          {rotations.map((item, i) => {
            const distance = prefersReducedMotion
              ? i
              : (i - activeCategory + rotations.length) % rotations.length;
            const pos = STACK_POSITIONS[distance];
            const opacity = prefersReducedMotion
              ? ACTIVE_OPACITY[distance]
              : isGeneral
                ? DIMMED_OPACITY
                : ACTIVE_OPACITY[distance];
            const filter =
              !prefersReducedMotion && isGeneral
                ? "saturate(0.4)"
                : "saturate(1)";

            return (
              <motion.div
                key={item.word}
                className="absolute inset-0"
                animate={{
                  scale: pos.scale,
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                  opacity,
                  filter,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ zIndex: pos.zIndex }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[28px] shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 26rem, 80vw"
                    className="object-contain"
                    priority={i === 0}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
