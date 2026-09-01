import CategoryForm from "@/components/admin/CategoryForm";

export const metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">
        New Category
      </h1>
      <div className="mt-8">
        <CategoryForm />
      </div>
    </div>
  );
}
