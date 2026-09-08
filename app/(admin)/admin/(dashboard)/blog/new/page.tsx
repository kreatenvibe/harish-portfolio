import BlogPostForm from "@/components/admin/BlogPostForm";

export const metadata = {
  title: "New Post",
};

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
        New Post
      </h1>
      <div className="mt-8">
        <BlogPostForm />
      </div>
    </div>
  );
}
