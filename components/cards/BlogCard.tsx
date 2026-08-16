import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { IBlogPost } from "@/database";

export default function BlogCard({ post }: { post: IBlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f4f4f2]">
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

      <div className="flex flex-1 flex-col p-6">
        {post.publishedAt && (
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {formatDate(post.publishedAt)}
          </p>
        )}
        <h3 className="mt-3 font-heading text-xl font-bold leading-tight text-foreground group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 font-sans text-sm leading-6 text-muted">
          {post.excerpt}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f4f4f2] px-3 py-1 font-sans text-xs font-medium text-muted"
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
