import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/actions/project.action";
import ProjectDetail from "@/components/sections/ProjectDetail";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const result = await getProjectBySlug(resolvedParams.slug);
  const project = result.data;

  if (!result.success || !project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const images = project.media
    ?.filter((m: any) => m.type === "image")
    .map((m: any) => m.url) || [];

  return {
    title: project.title,
    description: project.challenge?.substring(0, 160) || `Read about our work on ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.challenge?.substring(0, 160) || `Read about our work on ${project.title}`,
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.challenge?.substring(0, 160) || `Read about our work on ${project.title}`,
      images: images,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const result = await getProjectBySlug(resolvedParams.slug);
  const project = result.data;

  if (!result.success || !project) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <ProjectDetail project={project} />
      </section>
    </main>
  );
}
