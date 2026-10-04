import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { getCategories, getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";
import { getProjectSections } from "@/lib/actions/section.action";
import { getMediaBySection } from "@/lib/actions/media.action";

import ProjectDetail from "@/components/sections/ProjectDetail";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import type { IMedia, IProjectSection } from "@/database";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const result = await getCategoryBySlug(categorySlug);

  if (!result.success || !result.data || !result.data.isActive) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const category = result.data;
  const title = `${category.name} — Gallery & Deliverables`;
  const description =
    category.description ||
    `Explore selected ${category.name} portfolio assets and deliverables by Harish Kumar G.`;

  const images = category.coverImage?.url ? [category.coverImage.url] : [];

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

export default async function CategoryWorkPage({ params }: Props) {
  const { category: categorySlug } = await params;

  const [categoryResult, allCategoriesResult] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategories({ pageSize: 50 }, true),
  ]);

  if (
    !categoryResult.success ||
    !categoryResult.data ||
    !categoryResult.data.isActive
  ) {
    notFound();
  }

  const category = categoryResult.data;
  const allCategories = allCategoriesResult.data?.categories ?? [];

  // Find previous & next categories for quick pagination
  const currentIndex = allCategories.findIndex(
    (c) => String(c._id) === String(category._id) || c.slug === category.slug
  );
  const prevCategory =
    currentIndex > 0 ? allCategories[currentIndex - 1] : null;
  const nextCategory =
    currentIndex !== -1 && currentIndex < allCategories.length - 1
      ? allCategories[currentIndex + 1]
      : null;

  // Fetch all projects for this category
  const projectsResult = await getProjects(
    {
      categoryId: String(category._id),
      pageSize: 100,
    },
    true
  );

  const projects = projectsResult.data?.projects ?? [];
  const primaryProject = projects[0];

  // Fetch sections and media for all projects in this category
  let consolidatedSections: (IProjectSection & { media: IMedia[] })[] = [];

  if (projects.length > 0) {
    for (const proj of projects) {
      const sectionsResult = await getProjectSections(String(proj._id));
      const sections: IProjectSection[] = sectionsResult.data ?? [];

      for (const sec of sections) {
        const mediaResult = await getMediaBySection(String(sec._id));
        const media: IMedia[] = mediaResult.data ?? [];
        consolidatedSections.push({
          ...sec,
          title: sec.title || proj.title,
          description: sec.description || proj.description || "",
          media,
        });
      }
    }
  }

  // Count total media assets
  const totalAssetsCount = consolidatedSections.reduce(
    (acc, sec) => acc + (sec.media?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. EDITORIAL CATEGORY HEADER & HUD MATRIX */}
      <header className="relative border-b border-line bg-background pt-24 pb-14 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-6 lg:px-8 2xl:px-12 3xl:px-16 space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted"
            >
              <Link
                href="/work"
                className="transition-colors hover:text-foreground"
              >
                [ ALL PROJECTS ]
              </Link>
              <span className="text-line">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>

            <FrameCounter
              index={String(currentIndex !== -1 ? currentIndex + 1 : 1).padStart(2, "0")}
              total={allCategories.length || 16}
              label={`DISCIPLINE // ${category.name.toUpperCase()}`}
            />
          </div>

          {/* Main Category Headline */}
          <div className="space-y-4">
            <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[9.5rem] font-black uppercase leading-[0.88] tracking-tight text-foreground">
              {category.name}
            </h1>
            {category.description && (
              <p className="font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-muted max-w-3xl pt-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN GALLERY SECTION */}
      <main className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-6 py-12 lg:px-8 lg:py-20 2xl:px-12 3xl:px-16 space-y-16 lg:space-y-24">
        {consolidatedSections.length === 0 || totalAssetsCount === 0 ? (
          <div className="relative rounded border border-line bg-surface p-16 text-center space-y-4 shadow-xl">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <TrackingPoint className="top-4 right-4" variant="cross" />
            <p className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              NO ASSETS CATALOGED
            </p>
            <p className="font-sans text-base text-muted max-w-md mx-auto">
              Assets for {category.name} are currently being organized.
            </p>
            <Link
              href="/work"
              className="inline-block rounded border border-line bg-surface px-5 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-white/40"
            >
              [ RETURN TO ALL WORK ]
            </Link>
          </div>
        ) : (
          <ProjectDetail
            project={primaryProject || { title: category.name, enableFullscreenGallery: true }}
            sections={consolidatedSections}
          />
        )}
      </main>

      {/* 3. CATEGORY NAVIGATION & INQUIRY FOOTER */}
      <footer className="border-t border-line bg-surface/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1720px] px-6 lg:px-8 2xl:px-12 3xl:px-16 space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Previous Category */}
            {prevCategory ? (
              <Link
                href={`/work/${prevCategory.slug}`}
                className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-white/40 hover:bg-surface"
              >
                <span className="frame-corner-tl" aria-hidden="true" />
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  <ArrowLeft weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>PREVIOUS DISCIPLINE</span>
                </div>
                <div className="mt-8">
                  <span className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                    {prevCategory.name}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/work"
                className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-white/40 hover:bg-surface"
              >
                <span className="frame-corner-tl" aria-hidden="true" />
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  <ArrowLeft weight="bold" className="transition-transform duration-300 group-hover:-translate-x-1" />
                  <span>ALL PROJECTS</span>
                </div>
                <div className="mt-8">
                  <span className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                    INDEX OF ALL WORK
                  </span>
                </div>
              </Link>
            )}

            {/* Next Category */}
            {nextCategory ? (
              <Link
                href={`/work/${nextCategory.slug}`}
                className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-white/40 hover:bg-surface"
              >
                <span className="frame-corner-tl" aria-hidden="true" />
                <div className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  <span>NEXT DISCIPLINE</span>
                  <ArrowRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <div className="mt-8">
                  <span className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                    {nextCategory.name}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/work"
                className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-white/40 hover:bg-surface"
              >
                <span className="frame-corner-tl" aria-hidden="true" />
                <div className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                  <span>DISCIPLINES</span>
                  <ArrowRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                <div className="mt-8">
                  <span className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                    BACK TO WORK OVERVIEW
                  </span>
                </div>
              </Link>
            )}

            {/* Commission / Inquiry */}
            <Link
              href="/contact"
              className="group relative flex flex-col justify-between rounded-lg border border-line bg-surface/70 p-8 transition-all duration-300 hover:border-white/40 hover:bg-surface sm:col-span-2 lg:col-span-1"
            >
              <span className="frame-corner-tl" aria-hidden="true" />
              <div className="flex items-center justify-between font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                <span>NEW INQUIRY</span>
                <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </div>
              <div className="mt-8">
                <span className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                  START A PROJECT →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
