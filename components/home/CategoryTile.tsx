"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGGER, DURATION_SECTION, prefersReducedMotion } from "@/lib/motion";
import type { ICategory } from "@/database";

export function CategoryTile({
  category,
  index,
}: {
  category: ICategory;
  index: number;
}) {
  const tileRef = useRef<HTMLAnchorElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tile = tileRef.current;
    const underline = underlineRef.current;
    if (!tile || !underline) return;

    if (prefersReducedMotion()) {
      gsap.set(underline, { scaleX: 1 });
      return;
    }

    // Category name underline draws from 0 to 100% width as the last motion beat in that tile
    const underlineDelay = (index * STAGGER) + (DURATION_SECTION * 0.7);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        underline,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.5,
          delay: underlineDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, tileRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <Link
      ref={tileRef}
      href={`/work/${category.slug}`}
      className="group relative flex flex-col justify-between rounded-[var(--radius-card)] bg-surface p-7 shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
          0{index + 1}
        </span>
        <div className="relative mt-4 inline-block pb-1">
          <h3 className="font-heading text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
            {category.name}
          </h3>
          {/* Animated settling underline */}
          <span
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-[2px] w-full bg-accent/70"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
        </div>
        <p className="mt-3 font-sans text-sm leading-6 text-muted">
          {category.description ||
            `Browse client work and case studies in ${category.name.toLowerCase()}.`}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-foreground/70 transition-colors group-hover:text-accent">
        <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 group-hover:after:scale-x-100">
          Explore projects
        </span>
        <ArrowRight
          weight="bold"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
