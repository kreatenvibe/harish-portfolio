"use client";

import { FrameUniverseStage } from "./FrameUniverseStage";
import type { IProject } from "@/database";

interface HeroProps {
  featuredProjects?: IProject[];
}

export function Hero({ featuredProjects = [] }: HeroProps) {
  return <FrameUniverseStage projects={featuredProjects} />;
}
