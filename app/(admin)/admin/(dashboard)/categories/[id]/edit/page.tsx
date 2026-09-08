import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/actions/category.action";

export const metadata = {
  title: "Edit Category",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCategoryById(id);
  if (!result.success || !result.data) notFound();

  return (
    <div>
      <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
        Edit Category
      </h1>
      <div className="mt-8">
        <CategoryForm category={result.data} />
      </div>
    </div>
  );
}
