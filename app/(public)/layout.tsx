import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCategories } from "@/lib/actions/category.action";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesResult = await getCategories({ pageSize: 50 }, true);
  const categories = categoriesResult.data?.categories ?? [];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}
