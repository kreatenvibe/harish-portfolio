import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/actions/project.action";

export const metadata = {
  title: "Edit Project",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProjectById(id);
  if (!result.success || !result.data) notFound();

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Edit Project
      </h1>
      <div className="mt-8">
        <ProjectForm project={result.data} />
      </div>
    </div>
  );
}
