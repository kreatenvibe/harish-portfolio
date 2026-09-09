import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { getProjectBySlug } from "@/lib/actions/project.action";
import { getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjectSections } from "@/lib/actions/section.action";
import { getMediaBySection } from "@/lib/actions/media.action";
import { getImageKitUrl } from "@/lib/imagekit";

import ProjectDetail from "@/components/sections/ProjectDetail";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import type { IMedia, IProjectSection } from "@/database";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

async function loadProjectAndCategory(
  categorySlug: string,
  projectSlug: string
) {
  const [categoryResult, projectResult] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProjectBySlug(projectSlug),
  ]);

  if (!categoryResult.success || !categoryResult.data) {
    return null;
  }

  if (
    !projectResult.success ||
    !projectResult.data ||
    projectResult.data.status !== "published"
  ) {
    return null;
  }

  const category = categoryResult.data;
  const project = projectResult.data;

  if (String(project.categoryId) !== String(category._id)) {
    return null;
  }

  return {
    category,
    project,
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { category: categorySlug, slug: projectSlug } = await params;

  const data = await loadProjectAndCategory(categorySlug, projectSlug);

  if (!data) {
    return {
      title: "Project Not Found",
    };
  }

  const { project, category } = data;

  const title =
    project.seo?.title || `${project.title} — ${category.name}`;

  const description =
    project.seo?.description ||
    project.description?.substring(0, 160) ||
    `Case study and visual deliverables for ${project.title}.`;

  const images = project.seo?.ogImage?.url
    ? [project.seo.ogImage.url]
    : project.coverImage?.url
      ? [project.coverImage.url]
      : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { category: categorySlug, slug: projectSlug } = await params;

  const data = await loadProjectAndCategory(categorySlug, projectSlug);

  if (!data) {
    notFound();
  }

  const { category, project } = data;

  const sectionsResult = await getProjectSections(String(project._id));
  const sections: IProjectSection[] = sectionsResult.data ?? [];

  const sectionsWithMedia = await Promise.all(
    sections.map(async (section) => {
      const mediaResult = await getMediaBySection(String(section._id));
      const media: IMedia[] = mediaResult.data ?? [];

      return {
        ...section,
        media,
      };
    })
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. EDITORIAL HEADER & METADATA MATRIX */}
      <header className="relative border-b border-line bg-background pt-24 pb-14 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted"
            >
              <Link
                href="/work"
                className="transition-colors hover:text-foreground"
              >
                [ WORK ARCHIVE ]
              </Link>
              <span className="text-line">/</span>
              <Link
                href={`/work/${category.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {category.name}
              </Link>
              <span className="text-line">/</span>
              <span className="text-foreground">{project.title}</span>
            </nav>

            <FrameCounter index="01" total={sectionsWithMedia.length + 1} label="CHAPTER BREAKDOWN" />
          </div>

          {/* Main Project Headline */}
          <div className="space-y-4">
            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.88] tracking-tight text-foreground">
              {project.title}
            </h1>
          </div>

          {/* Technical Metadata Matrix (4-column HUD card strip) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 pt-2">
            <div className="relative rounded border border-line bg-surface p-5 space-y-2">
              <span className="frame-corner-tl" aria-hidden="true" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                DISCIPLINE
              </p>
              <p className="font-heading text-xl font-bold uppercase text-foreground">
                {category.name}
              </p>
            </div>

            <div className="relative rounded border border-line bg-surface p-5 space-y-2">
              <span className="frame-corner-tl" aria-hidden="true" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                CLIENT / STUDIO
              </p>
              <p className="font-heading text-xl font-bold uppercase text-foreground truncate">
                {project.client || "STUDIO PRODUCTION"}
              </p>
            </div>

            <div className="relative rounded border border-line bg-surface p-5 space-y-2">
              <span className="frame-corner-tl" aria-hidden="true" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                YEAR / TAGS
              </p>
              <p className="font-heading text-xl font-bold uppercase text-foreground truncate">
                {project.year ? `${project.year} • ` : ""}{project.tags?.[0] || "VISUAL SYSTEM"}
              </p>
            </div>

            <div className="relative rounded border border-line bg-surface p-5 space-y-2">
              <span className="frame-corner-tl" aria-hidden="true" />
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                CHAPTERS
              </p>
              <p className="font-heading text-xl font-bold uppercase text-foreground">
                {sectionsWithMedia.length > 0
                  ? `0${sectionsWithMedia.length} SECTIONS`
                  : "01 MASTER PLATE"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO COVER IMAGE PLATE */}
      {project.coverImage?.url && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded border border-line bg-surface shadow-2xl">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <span className="frame-corner-bl" aria-hidden="true" />
            <span className="frame-corner-br" aria-hidden="true" />
            <TrackingPoint className="top-4 left-4" variant="bracket" />
            <TrackingPoint className="bottom-4 right-4" variant="cross" />

            <Image
              src={getImageKitUrl(project.coverImage.url)}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
              unoptimized
            />
          </div>
        </section>
      )}

      {/* 3. CASE STUDY NARRATIVE & CHAPTERS */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-20 space-y-16 lg:space-y-24">
        {/* Project Overview Narrative */}
        {project.description && (
          <div className="relative rounded border border-line bg-surface p-8 sm:p-12 space-y-4">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
              CHAPTER 00 // PROJECT BRIEF
            </p>
            <p className="font-sans text-lg md:text-xl leading-relaxed text-foreground/90 whitespace-pre-line">
              {project.description}
            </p>
          </div>
        )}

        {/* Dynamic Project Sections with Elevated Media Blocks */}
        <ProjectDetail
          project={project}
          sections={sectionsWithMedia}
        />
      </main>

      {/* 4. PROJECT EXIT & INQUIRY FOOTER */}
      <footer className="border-t border-line bg-surface/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Back to Discipline */}
            <Link
              href={`/work/${category.slug}`}
              className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-accent hover:bg-surface"
            >
              <span className="frame-corner-tl" aria-hidden="true" />
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                <ArrowLeft weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span>RETURN TO {category.name}</span>
              </div>
              <div className="mt-8">
                <span className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground transition-colors group-hover:text-accent">
                  [ MORE {category.name} PLATES ]
                </span>
              </div>
            </Link>

            {/* Next Project / Inquiry */}
            <Link
              href="/contact"
              className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-accent hover:bg-surface"
            >
              <span className="frame-corner-tl" aria-hidden="true" />
              <div className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                <span>INITIATE SIMILAR PROJECT</span>
                <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1 text-accent" />
              </div>
              <div className="mt-8">
                <span className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground transition-colors group-hover:text-accent">
                  COMMISSION STUDIO WORK →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}