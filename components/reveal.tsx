"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
} as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof typeof TAGS;
}) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
