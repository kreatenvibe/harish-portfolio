import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectSectionsManager from "@/components/admin/ProjectSectionsManager";
import { getProjectById } from "@/lib/actions/project.action";
import { getCategories } from "@/lib/actions/category.action";
import { getProjectSections } from "@/lib/actions/section.action";

export const metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [projectResult, categoriesResult, sectionsResult] = await Promise.all([
    getProjectById(id),
    getCategories({ pageSize: 100 }),
    getProjectSections(id),
  ]);

  if (!projectResult.success || !projectResult.data) notFound();

  const categories = categoriesResult.data?.categories ?? [];
  const sections = sectionsResult.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
        Edit Project
      </h1>
      <div className="mt-8">
        <ProjectForm project={projectResult.data} categories={categories} />
      </div>

      <div className="mt-14 max-w-3xl border-t border-line pt-10">
        <h2 className="font-heading text-2xl uppercase tracking-wider text-foreground">
          Sections
        </h2>
        <p className="mt-2 font-sans text-sm text-muted">
          Group this project&apos;s media into sections. Sections and their
          order are entirely up to you.
        </p>
        <div className="mt-6">
          <ProjectSectionsManager projectId={id} sections={sections} />
        </div>
      </div>
    </div>
  );
}
