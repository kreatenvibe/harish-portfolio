"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION_SECTION, EASE_IN, STAGGER, prefersReducedMotion } from "@/lib/motion";

interface StaggerGridProps {
  children: React.ReactNode;
  stagger?: number;
  duration?: number;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  triggerHook?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const CLIP_INITIAL_MAP = {
  right: "inset(0% 100% 0% 0%)",
  left: "inset(0% 0% 0% 100%)",
  down: "inset(0% 0% 100% 0%)",
  up: "inset(100% 0% 0% 0%)",
};

export function StaggerGrid({
  children,
  stagger = STAGGER,
  duration = DURATION_SECTION,
  className = "",
  direction = "right",
  triggerHook = "top 85%",
  as: Component = "div",
}: StaggerGridProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.children) as HTMLElement[];
    if (items.length === 0) return;

    const isReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (isReduced) {
        gsap.fromTo(
          items,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            stagger,
            scrollTrigger: {
              trigger: container,
              start: triggerHook,
              once: true,
            },
          }
        );
        return;
      }

      // Drop-and-settle physical landing feel matching the Hero assembly sequence
      gsap.fromTo(
        items,
        {
          y: 28,
          opacity: 0,
          willChange: "transform, opacity",
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger, // Strict DOM order stagger
          ease: "back.out(1.2)",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: container,
            start: triggerHook,
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction, stagger, duration, triggerHook]);

  const Comp = Component as any;

  return (
    <Comp ref={containerRef} className={className}>
      {children}
    </Comp>
  );
}
