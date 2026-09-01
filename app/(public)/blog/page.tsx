import { getBlogPosts } from "@/lib/actions/blog.action";
import BlogCard from "@/components/cards/BlogCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const result = await getBlogPosts({ pageSize: 100 }, true);
  const posts = result.data?.blogPosts ?? [];

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pt-32">
        <div className="max-w-4xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Blog
          </p>
          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Notes on VFX, design, and the work behind it.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        {posts.length === 0 ? (
          <p className="font-sans text-lg text-muted">
            No posts published yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={String(post._id)} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
