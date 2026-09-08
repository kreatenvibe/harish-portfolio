import { Hero } from "@/components/home/hero/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { WorkUniverse } from "@/components/portfolio/WorkUniverse";
import { IdentityDossier } from "@/components/home/IdentityDossier";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { TechnicalLayerStack } from "@/components/sections/TechnicalLayerStack";
import { FinalFrame } from "@/components/home/FinalFrame";
import { CameraJourneyCanvas } from "@/components/home/3d/CameraJourneyCanvas";
import { getCategories } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categoriesResult, featuredProjectsResult] = await Promise.all([
    getCategories({ pageSize: 50 }, true),
    getProjects({ filter: "featured", pageSize: 8 }, true),
  ]);

  const categories = categoriesResult.data?.categories ?? [];
  let featuredProjects = featuredProjectsResult.data?.projects ?? [];

  // Fallback to published projects if no featured projects found
  if (featuredProjects.length === 0) {
    const fallbackProjects = await getProjects({ pageSize: 8 }, true);
    featuredProjects = fallbackProjects.data?.projects ?? [];
  }

  const categorySlugMap: Record<string, string> = {};
  categories.forEach((cat) => {
    if (cat._id) categorySlugMap[String(cat._id)] = cat.slug;
  });

  return (
    <div className="relative w-full bg-background text-foreground">
      {/* PERSISTENT 3D CAMERA SPATIAL JOURNEY */}
      <CameraJourneyCanvas />

      {/* FRAME 00 / 01 — OPENING STAGE & HERO */}
      <Hero featuredProjects={featuredProjects} />

      {/* FRAME 02 — SELECTED WORK / FILM STRIP SHOWCASE */}
      <FeaturedSection
        projects={featuredProjects}
        categorySlugMap={categorySlugMap}
      />

      {/* FRAME 03 — FOUR DISCIPLINE WORLDS */}
      <WorkUniverse categories={categories} />

      {/* FRAME 04 — IDENTITY DOSSIER */}
      <IdentityDossier />

      {/* FRAME 05 — CAREER PRODUCTION TIMELINE */}
      <CareerTimeline />

      {/* FRAME 06 — TECHNICAL COMPOSITING LAYER STACK */}
      <TechnicalLayerStack />

      {/* FRAME 07 — FINAL FRAME // INITIATE */}
      <FinalFrame />
    </div>
  );
}
