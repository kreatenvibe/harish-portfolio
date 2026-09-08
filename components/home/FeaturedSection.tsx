"use client";

import { FilmStrip } from "@/components/portfolio/FilmStrip";
import type { IProject } from "@/database";

interface FeaturedSectionProps {
  projects: IProject[];
  categorySlugMap: Record<string, string>;
}

export function FeaturedSection({
  projects,
  categorySlugMap,
}: FeaturedSectionProps) {
  return (
    <FilmStrip
      projects={projects}
      categorySlugMap={categorySlugMap}
    />
  );
}
