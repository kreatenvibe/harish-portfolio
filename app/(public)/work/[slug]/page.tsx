import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/actions/project.action";
import { getProjectSections } from "@/lib/actions/section.action";
import { getMediaBySection } from "@/lib/actions/media.action";
import ProjectDetail from "@/components/sections/ProjectDetail";
import type { IMedia, IProjectSection } from "@/database";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function loadPublishedProject(slug: string) {
  const result = await getProjectBySlug(slug);
  if (!result.success || !result.data || result.data.status !== "published") {
    return null;
  }
  return result.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await loadPublishedProject(resolvedParams.slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const title = project.seo?.title || project.title;
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
  const resolvedParams = await params;
  const project = await loadPublishedProject(resolvedParams.slug);

  if (!project) notFound();

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
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <ProjectDetail project={project} sections={sectionsWithMedia} />
      </section>
    </main>
  );
}
