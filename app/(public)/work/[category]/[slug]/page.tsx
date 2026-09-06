import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { getProjectBySlug } from "@/lib/actions/project.action";
import { getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjectSections } from "@/lib/actions/section.action";
import { getMediaBySection } from "@/lib/actions/media.action";

import ProjectDetail from "@/components/sections/ProjectDetail";
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

  const data = await loadProjectAndCategory(
    categorySlug,
    projectSlug
  );

  if (!data) {
    notFound();
  }

  const { category, project } = data;

  const sectionsResult = await getProjectSections(
    String(project._id)
  );

  const sections: IProjectSection[] =
    sectionsResult.data ?? [];

  const sectionsWithMedia = await Promise.all(
    sections.map(async (section) => {
      const mediaResult = await getMediaBySection(
        String(section._id)
      );

      const media: IMedia[] =
        mediaResult.data ?? [];

      return {
        ...section,
        media,
      };
    })
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===================================================================== */}
      {/* 1. EDITORIAL HEADER & PROJECT IDENTITY                                */}
      {/* ===================================================================== */}
      <header className="border-b border-line bg-background pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-10">
          {/* Breadcrumbs & Discipline Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted"
            >
              <Link
                href="/work"
                className="transition-colors hover:text-foreground"
              >
                Work
              </Link>
              <span className="text-line">/</span>
              <Link
                href={`/work/${category.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {category.name}
              </Link>
              <span className="text-line">/</span>
              <span className="text-accent font-semibold">{project.title}</span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {category.name}
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="font-heading text-6xl font-black uppercase leading-[0.88] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              {project.title}
            </h1>
          </div>

          {/* Metadata Bento Strip (Paper surface cards with restrained elevation) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 pt-4">
            <div className="rounded-[var(--radius-card)] bg-surface p-6 shadow-card-resting transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                Category
              </p>
              <p className="mt-3 font-heading text-xl font-bold uppercase text-foreground">
                {category.name}
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface p-6 shadow-card-resting transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                Client / Brand
              </p>
              <p className="mt-3 font-heading text-xl font-bold uppercase text-foreground truncate">
                {project.client || "Studio Work"}
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface p-6 shadow-card-resting transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                Disciplines
              </p>
              <p className="mt-3 font-heading text-xl font-bold uppercase text-foreground truncate">
                {project.tags?.[0] || "Visual Design"}
              </p>
            </div>

            <div className="rounded-[var(--radius-card)] bg-surface p-6 shadow-card-resting transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                Deliverables
              </p>
              <p className="mt-3 font-heading text-xl font-bold uppercase text-accent">
                {sectionsWithMedia.length > 0
                  ? `${sectionsWithMedia.length} Case Chapters`
                  : "Complete Suite"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. HERO COVER IMAGE (Framed Elevation)                                 */}
      {/* ===================================================================== */}
      {project.coverImage?.url && (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-6 lg:-mt-10">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-card-hover">
            <Image
              src={project.coverImage.url}
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

      {/* ===================================================================== */}
      {/* 3. EDITORIAL CASE STUDY NARRATIVE & SECTIONS                          */}
      {/* ===================================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28 space-y-20 lg:space-y-28">
        {/* Project Overview Narrative */}
        {project.description && (
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Project Brief &amp; Overview
            </span>
            <div className="rounded-[var(--radius-card)] bg-surface p-8 sm:p-12 shadow-card-resting">
              <p className="font-sans text-lg md:text-xl leading-relaxed text-foreground/85 whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Project Sections with Elevated Media Blocks */}
        <ProjectDetail
          project={project}
          sections={sectionsWithMedia}
        />
      </main>

      {/* ===================================================================== */}
      {/* 4. PROJECT EXIT & INQUIRY FOOTER                                      */}
      {/* ===================================================================== */}
      <footer className="border-t border-line bg-surface/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Back to Discipline */}
            <Link
              href={`/work/${category.slug}`}
              className="group flex flex-col justify-between rounded-[var(--radius-card)] bg-surface p-8 shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                <ArrowLeft weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span>Return to Category</span>
              </div>
              <div className="mt-8">
                <span className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground transition-colors group-hover:text-accent">
                  {category.name}
                </span>
              </div>
            </Link>

            {/* Next Project / Inquiry */}
            <Link
              href="/contact"
              className="group flex flex-col justify-between rounded-[var(--radius-card)] bg-surface p-8 shadow-card-resting transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                <span>Start a Collaboration</span>
                <ArrowRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1 text-accent" />
              </div>
              <div className="mt-8">
                <span className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground transition-colors group-hover:text-accent">
                  Work With Me
                </span>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}