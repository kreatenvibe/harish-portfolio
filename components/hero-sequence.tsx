"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SoftwareShowcase } from "./software-showcase";

const DELAYS = {
  eyebrow: 0.1,
  phrase1: 0.5,
  showcase: 1.4,
};

const FADE = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  }),
};

const FADE_NO_MOTION = {
  hidden: {
    opacity: 1,
    y: 0,
  },
  visible: () => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
    },
  }),
};

export function HeroSequence() {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? FADE_NO_MOTION : FADE;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 lg:px-8 lg:pt-16 lg:pb-32">
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

      {/* First Statement */}
      <motion.h1
        className="mt-6 max-w-5xl font-heading text-5xl font-bold leading-[0.92] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
        initial="hidden"
        animate="visible"
        custom={prefersReducedMotion ? 0 : DELAYS.phrase1}
        variants={variants}
      >
        Software that fits
        <br />
        your business.
      </motion.h1>

      {/* Showcase */}
      <motion.div
        className="mt-14 w-full"
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          delay: prefersReducedMotion ? 0 : DELAYS.showcase,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <SoftwareShowcase />
      </motion.div>

      {/* Second Statement */}
      <motion.div
        className="mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={variants}
        custom={0}
      >
        <h2 className="max-w-4xl font-heading text-5xl font-bold leading-[0.9] tracking-tight text-accent sm:text-6xl lg:text-7xl">
          Built around
          <br />
          your workflow.
        </h2>
      </motion.div>

      {/* Supporting Copy */}
      <motion.p
        className="mt-10 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={variants}
        custom={0.15}
      >
        We design and build custom software that fits the way your business
        actually works—from CRM systems and customer portals to billing
        platforms, internal tools, and AI automations. Every solution is
        tailored to your workflow, not the other way around.
      </motion.p>

      {/* CTA */}
      <motion.div
        className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={variants}
        custom={0.3}
      >
        <Link
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Start Your Project
        </Link>

        <Link
          href="#contact"
          className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
        >
          Discuss Your Needs
          <span aria-hidden>→</span>
        </Link>
      </motion.div>

      {/* Transition Statement */}
      <motion.div
        className="mt-24 border-l-2 border-accent pl-8"
        initial="hidden"
        animate="visible"
        custom={prefersReducedMotion ? 0 : 4.2}
        variants={variants}
      >
        <p className="max-w-5xl font-heading text-3xl font-semibold leading-[1.18] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Stop piecing your business together with spreadsheets,
          disconnected tools, and manual work.
          <br />
          Bring your processes into one reliable digital system
          built around the way your business actually works.
        </p>
      </motion.div>
    </section>
  );
}