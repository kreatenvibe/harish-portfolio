"use client";

import { FrameUniverseStage } from "./FrameUniverseStage";
import type { IProject } from "@/database";

interface HeroProps {
  featuredProjects?: IProject[];
  categorySlugMap?: Record<string, string>;
}

export function Hero({
  featuredProjects = [],
  categorySlugMap = {},
}: HeroProps) {
  return (
    <FrameUniverseStage
      projects={featuredProjects}
      categorySlugMap={categorySlugMap}
    />
  );
}
