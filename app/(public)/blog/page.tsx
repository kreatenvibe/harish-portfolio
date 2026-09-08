import { getBlogPosts } from "@/lib/actions/blog.action";
import BlogCard from "@/components/cards/BlogCard";
import { FrameCounter } from "@/components/frame/FrameCounter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — Notes & Insights",
  description: "Notes on VFX plate preparation, visual identity systems, and design craft by Harish Kumar G.",
};

export default async function BlogPage() {
  const result = await getBlogPosts({ pageSize: 100 }, true);
  const posts = result.data?.blogPosts ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Blog Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-14 lg:px-8 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl space-y-6">
          <FrameCounter index="05" total={7} label="JOURNAL // ESSAYS" />

          <div className="max-w-3xl space-y-4">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
              Notes on Craft.
            </h1>
            <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
              Documenting technical workflows in Paint &amp; Roto, branding system architecture, and production lessons across broadcast media.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {posts.length === 0 ? (
          <div className="relative rounded-lg border border-line bg-surface/40 p-16 text-center space-y-4">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted font-semibold">
              JOURNAL LOGS COMING SOON
            </p>
            <p className="font-sans text-base text-muted">
              Articles and case study deep-dives are currently in production.
            </p>
          </div>
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
