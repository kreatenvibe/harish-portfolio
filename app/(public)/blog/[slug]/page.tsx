import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import { getBlogPostBySlug } from "@/lib/actions/blog.action";
import { formatDate } from "@/lib/utils";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="mt-12 font-heading text-3xl font-bold text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 font-heading text-2xl font-bold text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 font-heading text-xl font-semibold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-accent underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-accent pl-5 text-muted italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-xl bg-surface p-5 font-mono text-sm">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="mt-6 w-full rounded-xl"
    />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getBlogPostBySlug(slug);
  if (!result.success || !result.data || !result.data.published) notFound();

  const post = result.data;

  return (
    <main className="bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-20 lg:px-8 lg:pt-32">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1 font-sans text-xs font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        {post.publishedAt && (
          <p className="mt-5 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-muted">
            {formatDate(post.publishedAt)}
          </p>
        )}

        {post.coverImage?.url && (
          <div className="relative mt-10 aspect-16/9 w-full overflow-hidden rounded-2xl bg-surface">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="mt-12 font-sans text-base leading-8 text-foreground">
          <ReactMarkdown components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
