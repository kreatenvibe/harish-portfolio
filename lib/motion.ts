/**
 * Shared Motion & Animation Tokens for GSAP & Lenis
 *
 * All animations, transitions, and scroll triggers across the application
 * should import these constants rather than hardcoding ease, duration, or
 * stagger values.
 *
 * Rule: When creating animations or GSAP timelines, always check
 * `prefersReducedMotion()` to short-circuit complex motion, transform, or scrub
 * effects into simple opacity-only fallbacks for users with reduced motion preferences.
 */

export const EASE_IN = "power3.out";
export const EASE_SCRUB = "power2.inOut";
export const DURATION_SECTION = 0.75;
export const DURATION_MICRO = 0.25;
export const STAGGER = 0.06;

/**
 * Checks whether the user has requested the system to minimize the amount of animation/motion.
 * Safe to execute in browser environments; returns false on server / SSR.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
