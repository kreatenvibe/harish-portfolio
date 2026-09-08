import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getBlogPosts } from "@/lib/actions/blog.action";
import { deleteBlogPost } from "@/lib/actions/blog.action";
import { formatDate } from "@/lib/utils";
import FilterBar from "@/components/filters/FilterBar";
import TogglePublishedButton from "@/components/admin/TogglePublishedButton";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const metadata = {
  title: "Blog",
};

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; filter?: string; page?: string }>;
}) {
  const { query, filter, page } = await searchParams;
  const result = await getBlogPosts({
    query,
    filter,
    page: page ? Number(page) : 1,
    pageSize: 20,
  });

  const posts = result.data?.blogPosts ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl uppercase tracking-wider text-foreground">
            Blog
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
            {result.data?.total ?? 0} post{result.data?.total === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-white cursor-pointer"
        >
          <Plus size={15} weight="bold" />
          New Post
        </Link>
      </div>

      <div className="mt-8">
        <FilterBar
          searchPlaceholder="Search posts…"
          filters={[
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </div>

      <div className="mt-8 divide-y divide-line border-t border-line">
        {posts.length === 0 ? (
          <p className="py-12 text-center font-sans text-sm text-muted">
            No posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={String(post._id)}
              className="flex items-center justify-between gap-6 py-5"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/blog/${post._id}/edit`}
                  className="font-sans text-base font-semibold text-foreground transition-colors hover:underline hover:text-white"
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <p className="mt-1 truncate font-sans text-sm text-muted">
                    {post.excerpt}
                  </p>
                )}
                <p className="mt-1 font-mono text-xs text-muted">
                  {post.publishedAt
                    ? formatDate(post.publishedAt)
                    : `Created ${formatDate(post.createdAt!)}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <TogglePublishedButton
                  id={String(post._id)}
                  published={post.published}
                />
                <AdminDeleteButton
                  action={async () => {
                    "use server";
                    return deleteBlogPost({ id: String(post._id) });
                  }}
                  confirmMessage={`Delete "${post.title}"? This cannot be undone.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
