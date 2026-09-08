"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

export function ScrollProgressTick() {
  const [progressPercent, setProgressPercent] = useState("00");
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          if (barRef.current) {
            // Move active bar indicator smoothly along vertical track
            gsap.set(barRef.current, { yPercent: p * 300 });
          }
          const formatted = Math.round(p * 100)
            .toString()
            .padStart(2, "0");
          setProgressPercent(formatted);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={containerRef}
      className="hidden lg:flex fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none w-10 flex-col justify-center items-end"
      aria-label="Scroll progress indicator"
      aria-hidden="true"
    >
      <div className="relative flex h-[200px] max-h-[240px] flex-col justify-between items-end pr-3">
        {/* Continuous hairline track line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-line/80" />

        {/* Section boundary notches acting as a lightweight map */}
        <div className="absolute right-0 top-[0%] w-1.5 h-px bg-line" />
        <div className="absolute right-0 top-[30%] w-1.5 h-px bg-line" />
        <div className="absolute right-0 top-[60%] w-1.5 h-px bg-line" />
        <div className="absolute right-0 top-[100%] w-1.5 h-px bg-line" />

        {/* Active Track Indicator */}
        <div
          ref={barRef}
          className="absolute right-0 top-0 h-[25%] w-[2px] bg-foreground will-change-transform"
        />

        {/* Dynamic Monospace Percent Indicator */}
        <div className="flex items-center gap-2 text-foreground/80 font-bold">
          <span className="font-mono text-[10px] tracking-widest">
            {progressPercent}
          </span>
          <span className="h-px w-2 bg-foreground/60" />
        </div>
      </div>
    </aside>
  );
}
