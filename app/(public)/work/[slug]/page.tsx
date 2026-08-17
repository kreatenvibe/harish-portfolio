import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/actions/project.action";
import ProjectDetail from "@/components/sections/ProjectDetail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
