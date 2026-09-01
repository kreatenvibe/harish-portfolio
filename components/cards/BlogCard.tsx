import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { IBlogPost } from "@/database";

export default function BlogCard({ post }: { post: IBlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block w-full">
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-foreground/10 bg-surface">
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-heading text-3xl font-bold text-accent/20">
              KV
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col">
        {post.publishedAt && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {formatDate(post.publishedAt)}
          </p>
        )}
        <div className="mt-3 flex items-start justify-between gap-4">
          <h3 className="font-heading text-xl font-bold leading-tight text-foreground">
            {post.title}
          </h3>
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-muted/5 text-foreground transition-all duration-300 group-hover:-rotate-45 group-hover:bg-foreground group-hover:text-background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
        <p className="mt-3 font-sans text-sm leading-6 text-muted">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
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
      </div>
    </Link>
  );
}
