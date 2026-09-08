import Link from "next/link";
import { getProjects } from "@/lib/actions/project.action";
import { getCategories } from "@/lib/actions/category.action";
import ProjectCard from "@/components/cards/ProjectCard";
import FilterBar from "@/components/filters/FilterBar";
import { FrameCounter } from "@/components/frame/FrameCounter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work Archive — HK Designs",
  description:
    "Explore the complete portfolio archive across Branding, Packaging, Social Media, Print Design, and VFX Paint & Roto.",
};

type Props = {
  searchParams: Promise<{ query?: string; filter?: string }>;
};

export default async function WorkPage({ searchParams }: Props) {
  const { query, filter } = await searchParams;

  const [categoriesResult, projectsResult] = await Promise.all([
    getCategories({ pageSize: 50 }, true),
    getProjects({ pageSize: 100, query }, true),
  ]);

  const categories = categoriesResult.data?.categories ?? [];
  let projects = projectsResult.data?.projects ?? [];

  // Build a lookup map of categoryId -> categorySlug
  const categorySlugMap: Record<string, string> = {};
  categories.forEach((cat) => {
    if (cat._id) {
      categorySlugMap[String(cat._id)] = cat.slug;
    }
  });

  // Unique tags across all projects for secondary filter
  const allTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  ).filter(Boolean);

  const tagFilters = allTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  if (filter) {
    projects = projects.filter((p) =>
      p.tags?.some((t) => t.toLowerCase() === filter.toLowerCase())
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Archive Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-12 lg:px-8 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl space-y-6">
          <FrameCounter index="02" total={7} label="WORK ARCHIVE" />

          <div className="max-w-4xl space-y-4">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
              Portfolio Archive.
            </h1>
            <p className="font-sans text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
              Complete index of brand identity systems, product packaging, motion campaigns, and broadcast VFX paint &amp; roto deliverables.
            </p>
          </div>

          {/* Category Filter Navigation */}
          {categories.length > 0 && (
            <div className="pt-6">
              <div className="flex flex-wrap items-center gap-2 border-b border-line/50 pb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted mr-3">
                  DISCIPLINE:
                </span>
                <Link
                  href="/work"
                  className="rounded border border-white/40 bg-white/10 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground"
                >
                  [ ALL PLATES ]
                </Link>
                {categories.map((cat, idx) => (
                  <Link
                    key={cat.slug}
                    href={`/work/${cat.slug}`}
                    className="rounded border border-line bg-surface px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:border-white/30 hover:text-foreground"
                  >
                    0{idx + 1} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search & Tag Filter Bar */}
          <div className="pt-2">
            <FilterBar
              filters={tagFilters}
              searchPlaceholder="Search project titles, clients, or tags…"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {projects.length === 0 ? (
          <div className="relative rounded border border-line bg-surface p-16 text-center space-y-4">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              NO MATCHING PLATES FOUND
            </p>
            <p className="font-sans text-base text-muted">
              {query || filter
                ? "No projects match your current search query or tag filter."
                : "Projects are currently being cataloged."}
            </p>
            {(query || filter) && (
              <Link
                href="/work"
                className="inline-block rounded border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-white/40"
              >
                Reset Search Filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={String(project._id)}
                project={project}
                index={index}
                categorySlug={categorySlugMap[String(project.categoryId)]}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
