import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getProjects, deleteProject } from "@/lib/actions/project.action";
import FilterBar from "@/components/filters/FilterBar";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const metadata = {
  title: "Work",
};

export default async function AdminWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; filter?: string; page?: string }>;
}) {
  const { query, filter, page } = await searchParams;
  const result = await getProjects({
    query,
    filter,
    page: page ? Number(page) : 1,
    pageSize: 20,
  });

  const projects = result.data?.projects ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Work
          </h1>
          <p className="mt-2 font-sans text-sm text-muted">
            {result.data?.total ?? 0} project
            {result.data?.total === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/work/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-white"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="mt-8">
        <FilterBar
          searchPlaceholder="Search projects…"
          filters={[{ value: "featured", label: "Featured" }]}
        />
      </div>

      <div className="mt-8 divide-y divide-foreground/10 border-t border-foreground/10">
        {projects.length === 0 ? (
          <p className="py-12 text-center font-sans text-sm text-muted">
            No projects yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={String(project._id)}
              className="flex items-center justify-between gap-6 py-5"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/work/${project._id}/edit`}
                  className="font-heading text-lg font-semibold text-foreground hover:text-accent"
                >
                  {project.title}
                </Link>
                <p className="mt-1 truncate font-sans text-sm text-muted">
                  {project.label}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {project.featured && (
                  <span className="rounded-full bg-accent/10 px-3 py-1.5 font-sans text-xs font-semibold text-accent">
                    Featured
                  </span>
                )}
                <AdminDeleteButton
                  action={async () => {
                    "use server";
                    return deleteProject({ id: String(project._id) });
                  }}
                  confirmMessage={`Delete "${project.title}"? This cannot be undone.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
