import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getProjectBySlug } from "@/lib/actions/project.action";
import { getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjectSections } from "@/lib/actions/section.action";
import { getMediaBySection } from "@/lib/actions/media.action";
import ProjectDetail from "@/components/sections/ProjectDetail";
import type { IMedia, IProjectSection } from "@/database";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

async function loadProjectAndCategory(categorySlug: string, projectSlug: string) {
  const [categoryResult, projectResult] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProjectBySlug(projectSlug),
  ]);

  if (
    !categoryResult.success ||
    !categoryResult.data ||
    !categoryResult.data.isActive
  ) {
    return null;
  }

  const category = categoryResult.data;

  if (
    !projectResult.success ||
    !projectResult.data ||
    projectResult.data.status !== "published"
  ) {
    return null;
  }

  const project = projectResult.data;

  // Verify that the project belongs to the category
  if (String(project.categoryId) !== String(category._id)) {
    return null;
  }

  return { category, project };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug, slug: projectSlug } = await params;
  const data = await loadProjectAndCategory(categorySlug, projectSlug);

  if (!data) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const { project, category } = data;
  const title = project.seo?.title || `${project.title} — ${category.name}`;
  const description =
    project.seo?.description ||
    project.description?.substring(0, 160) ||
    `Read about our work on ${project.title}`;
  const images = project.seo?.ogImage?.url
    ? [project.seo.ogImage.url]
    : project.coverImage?.url
      ? [project.coverImage.url]
      : [];

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { category: categorySlug, slug: projectSlug } = await params;
  const data = await loadProjectAndCategory(categorySlug, projectSlug);

  if (!data) notFound();

  const { category, project } = data;

  const sectionsResult = await getProjectSections(String(project._id));
  const sections: IProjectSection[] = sectionsResult.data ?? [];

  const sectionsWithMedia = await Promise.all(
    sections.map(async (section) => {
      const mediaResult = await getMediaBySection(String(section._id));
      const media: IMedia[] = mediaResult.data ?? [];
      return { ...section, media };
    })
  );

  return (
    <div className="theme-dark bg-background text-foreground min-h-full">
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex flex-wrap items-center font-sans text-sm font-semibold uppercase tracking-[0.15em] text-muted"
        >
          <Link
            href="/work"
            className="transition-colors hover:text-foreground"
          >
            Work
          </Link>
          <span className="mx-3 text-foreground/20">/</span>
          <Link
            href={`/work/${category.slug}`}
            className="transition-colors hover:text-foreground"
          >
            {category.name}
          </Link>
          <span className="mx-3 text-foreground/20">/</span>
          <span className="text-accent truncate max-w-xs sm:max-w-md">
            {project.title}
          </span>
        </nav>

        <ProjectDetail project={project} sections={sectionsWithMedia} />

        {/* Back Link */}
        <div className="mt-16 border-t border-foreground/10 pt-12 flex justify-between items-center">
          <Link
            href={`/work/${category.slug}`}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent hover:underline"
          >
            ← Back to all {category.name.toLowerCase()} work
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-foreground px-6 py-2.5 font-sans text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Inquire About This Project
          </Link>
        </div>
      </main>
    </div>
  );
}
