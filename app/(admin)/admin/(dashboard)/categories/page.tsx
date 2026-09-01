import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getCategories } from "@/lib/actions/category.action";
import FilterBar from "@/components/filters/FilterBar";
import CategoryList from "@/components/admin/CategoryList";

export const metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; filter?: string; page?: string }>;
}) {
  const { query, filter, page } = await searchParams;
  const result = await getCategories({
    query,
    filter,
    page: page ? Number(page) : 1,
    pageSize: 100,
  });

  const categories = result.data?.categories ?? [];
  const showDeleted = filter === "deleted";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Categories
          </h1>
          <p className="mt-2 font-sans text-sm text-muted">
            {result.data?.total ?? 0} categor
            {result.data?.total === 1 ? "y" : "ies"}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-white"
        >
          <Plus size={16} />
          New Category
        </Link>
      </div>

      <div className="mt-8">
        <FilterBar
          searchPlaceholder="Search categories…"
          filters={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "deleted", label: "Deleted" },
          ]}
        />
      </div>

      <div className="mt-8">
        <CategoryList categories={categories} showDeleted={showDeleted} />
      </div>
    </div>
  );
}
