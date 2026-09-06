"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION_SECTION, prefersReducedMotion } from "@/lib/motion";

type Direction = "left" | "right" | "up" | "down";

interface ClipRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  triggerHook?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ClipReveal({
  children,
  direction = "right",
  delay = 0,
  duration = DURATION_SECTION,
  className = "",
  triggerHook = "top 88%",
  as: Component = "div",
}: ClipRevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = elementRef.current;
    if (!el) return;

    const isReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (isReduced) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            delay,
            scrollTrigger: {
              trigger: el,
              start: triggerHook,
              once: true,
            },
          }
        );
        return;
      }

      // Physical drop-and-settle / bounce reveal with subtle overshoot easing
      const initialOffsets = {
        up: { y: 28, x: 0 },
        down: { y: -28, x: 0 },
        right: { x: -28, y: 0 },
        left: { x: 28, y: 0 },
      };

      const offset = initialOffsets[direction] || { y: 24, x: 0 };

      gsap.fromTo(
        el,
        {
          x: offset.x,
          y: offset.y,
          opacity: 0,
          willChange: "transform, opacity",
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.65,
          delay,
          ease: "back.out(1.3)",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: el,
            start: triggerHook,
            once: true,
          },
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [direction, delay, duration, triggerHook]);

  const Comp = Component as React.ElementType;

  return (
    <Comp ref={elementRef} className={className}>
      {children}
    </Comp>
  );
}
