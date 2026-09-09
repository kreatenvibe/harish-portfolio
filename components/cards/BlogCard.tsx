import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { formatDate } from "@/lib/utils";
import { getImageKitUrl } from "@/lib/imagekit";
import type { IBlogPost } from "@/database";

export default function BlogCard({ post }: { post: IBlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-line bg-surface/60 transition-all duration-300 hover:border-white/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
    >
      {/* 4 Corner Marks */}
      <span className="frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner-tr" aria-hidden="true" />
      <span className="frame-corner-bl" aria-hidden="true" />
      <span className="frame-corner-br" aria-hidden="true" />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-line/40 px-4 py-2 font-mono text-[10px] tracking-widest text-muted uppercase">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span>JOURNAL_ENTRY</span>
        </div>
        {post.publishedAt && (
          <span className="text-foreground/75 font-semibold">
            {formatDate(post.publishedAt)}
          </span>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-surface">
        {post.coverImage?.url ? (
          <Image
            src={getImageKitUrl(post.coverImage.url)}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#151518]">
            <span className="font-heading text-2xl uppercase tracking-widest text-muted/30">
              HK JOURNAL
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-white">
            {post.title}
          </h3>
          <p className="font-sans text-sm leading-relaxed text-muted line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Tags & Action */}
        <div className="flex items-center justify-between border-t border-line/40 pt-4 font-mono text-xs">
          <div className="flex flex-wrap gap-1.5">
            {post.tags && post.tags.length > 0 ? (
              post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-line bg-background/80 px-2 py-0.5 text-[10px] uppercase text-muted"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-muted/60 text-[10px] uppercase">READ ENTRY</span>
            )}
          </div>

          <div className="flex h-7 w-7 items-center justify-center rounded border border-line text-muted transition-all duration-300 group-hover:border-white/50 group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight size={12} weight="bold" />
          </div>
        </div>
      </div>
    </Link>
  );
}
