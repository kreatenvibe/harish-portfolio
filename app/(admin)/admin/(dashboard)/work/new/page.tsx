import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import { getCategories } from "@/lib/actions/category.action";

export const metadata = {
  title: "New Project",
};

export default async function NewProjectPage() {
  const categoriesResult = await getCategories({ pageSize: 100 });
  const categories = categoriesResult.data?.categories ?? [];

  return (
    <div>
      <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
        New Project
      </h1>
      {categories.length === 0 && (
        <p className="mt-4 rounded-md border border-line bg-surface p-4 font-mono text-xs text-muted">
          You need at least one category before creating a project.{" "}
          <Link href="/admin/categories/new" className="text-foreground underline">
            Create one
          </Link>
          .
        </p>
      )}
      <div className="mt-8">
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
