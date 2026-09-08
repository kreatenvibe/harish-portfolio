import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getProjects } from "@/lib/actions/project.action";
import { getCategories } from "@/lib/actions/category.action";
import FilterBar from "@/components/filters/FilterBar";
import CategoryFilterSelect from "@/components/admin/CategoryFilterSelect";
import ProjectList from "@/components/admin/ProjectList";

export const metadata = {
  title: "Work",
};

export default async function AdminWorkPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    page?: string;
    categoryId?: string;
  }>;
}) {
  const { query, filter, page, categoryId } = await searchParams;

  const [projectsResult, categoriesResult] = await Promise.all([
    getProjects({
      query,
      filter,
      categoryId,
      page: page ? Number(page) : 1,
      pageSize: 20,
    }),
    getCategories({ pageSize: 100 }),
  ]);

  const projects = projectsResult.data?.projects ?? [];
  const categories = categoriesResult.data?.categories ?? [];
  const categoryNameById = Object.fromEntries(
    categories.map((c) => [String(c._id), c.name])
  );
  const showDeleted = filter === "deleted";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-foreground">
            Work
          </h1>
          <p className="mt-1 font-mono text-xs text-muted">
            {projectsResult.data?.total ?? 0} project
            {projectsResult.data?.total === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/work/new"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-white cursor-pointer"
        >
          <Plus size={15} />
          New Project
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <FilterBar
          searchPlaceholder="Search projects…"
          filters={[
            { value: "featured", label: "Featured" },
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
            { value: "deleted", label: "Deleted" },
          ]}
        />
        <CategoryFilterSelect categories={categories} />
      </div>

      <div className="mt-8">
        <ProjectList
          projects={projects}
          categoryNameById={categoryNameById}
          showDeleted={showDeleted}
        />
      </div>
    </div>
  );
}
