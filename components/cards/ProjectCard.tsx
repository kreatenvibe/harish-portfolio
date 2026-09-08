"use client";

import { ProjectMatteCard } from "@/components/portfolio/ProjectMatteCard";
import type { IProject } from "@/database";

export default function ProjectCard({
  project,
  index,
  categorySlug,
  className = "",
}: {
  project: IProject;
  index: number;
  categorySlug?: string;
  animateEntrance?: boolean;
  className?: string;
}) {
  return (
    <ProjectMatteCard
      project={project}
      index={index}
      categorySlug={categorySlug}
      className={className}
    />
  );
}
