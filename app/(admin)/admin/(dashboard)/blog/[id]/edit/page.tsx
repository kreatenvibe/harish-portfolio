import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getBlogPostById } from "@/lib/actions/blog.action";

export const metadata = {
  title: "Edit Post",
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getBlogPostById(id);
  if (!result.success || !result.data) notFound();

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-foreground">
        Edit Post
      </h1>
      <div className="mt-8">
        <BlogPostForm post={result.data} />
      </div>
    </div>
  );
}
