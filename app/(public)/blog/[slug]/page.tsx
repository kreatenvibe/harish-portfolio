import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getBlogPostBySlug } from "@/lib/actions/blog.action";
import { formatDate } from "@/lib/utils";
import { getImageKitUrl } from "@/lib/imagekit";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h2 className="mt-12 font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 font-heading text-xl sm:text-2xl font-bold uppercase text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted first:mt-0">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-foreground font-semibold underline underline-offset-4 hover:text-white transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-2 pl-6 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 text-muted">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-foreground pl-6 font-heading text-xl italic uppercase text-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-8 overflow-x-auto rounded-lg border border-line bg-black/80 p-6 font-mono text-sm text-foreground">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      className="mt-8 w-full rounded-lg border border-line shadow-2xl"
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
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-14 lg:px-8 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft weight="bold" />
              <span>RETURN TO JOURNAL</span>
            </Link>

            <FrameCounter index="05" total={7} label="ESSAY ENTRY" />
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
              {post.title}
            </h1>

            {post.publishedAt && (
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                PUBLISHED: {formatDate(post.publishedAt)}
              </p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-line bg-surface px-3 py-1 font-mono text-xs font-medium uppercase text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Body */}
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        {post.coverImage?.url && (
          <div className="relative mb-16 aspect-16/9 w-full overflow-hidden rounded-lg border border-line bg-surface shadow-2xl">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <TrackingPoint className="top-4 left-4" variant="bracket" label="ARTICLE_COVER" />
            <Image
              src={getImageKitUrl(post.coverImage.url)}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="font-sans">
          <ReactMarkdown components={markdownComponents}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Back navigation */}
        <div className="mt-20 border-t border-line pt-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground hover:underline"
          >
            <ArrowLeft weight="bold" />
            <span>BACK TO JOURNAL ARCHIVE</span>
          </Link>
          <Link
            href="/contact"
            className="rounded border border-line bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-white/10 hover:border-white/40 transition-colors"
          >
            DISCUSS A PROJECT
          </Link>
        </div>
      </article>
    </main>
  );
}
