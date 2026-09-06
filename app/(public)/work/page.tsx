import Link from "next/link";
import { getProjects } from "@/lib/actions/project.action";
import { getCategories } from "@/lib/actions/category.action";
import ProjectCard from "@/components/cards/ProjectCard";
import FilterBar from "@/components/filters/FilterBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Work — HK Designs",
  description:
    "Explore design and VFX client work across Branding, Packaging, Social Media, and Print Design.",
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

  // Unique tags across all projects for optional secondary filter
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
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-8 lg:pb-16 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Selected Work
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Design and VFX work built with care.
          </h1>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            Browse our complete portfolio of brand identity systems, product packaging,
            social campaigns, and print collateral, alongside precision paint &amp; roto
            broadcast work.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3 border-b border-foreground/10 pb-6">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-muted mr-2">
              Categories:
            </span>
            <Link
              href="/work"
              className="rounded-full bg-primary px-5 py-2 font-sans text-xs font-semibold text-white shadow-sm"
            >
              All Projects
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/work/${cat.slug}`}
                className="rounded-full border border-foreground/10 bg-surface px-5 py-2 font-sans text-xs font-semibold text-foreground/80 transition-colors hover:border-accent hover:text-accent"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Search & Tag Filter Bar */}
        <div className="mt-8">
          <FilterBar
            filters={tagFilters}
            searchPlaceholder="Search all projects…"
          />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-foreground/10 bg-surface/50 p-12 text-center">
            <p className="font-sans text-lg text-muted">
              {query || filter
                ? "No projects match your search criteria."
                : "Projects are coming soon."}
            </p>
            {(query || filter) && (
              <Link
                href="/work"
                className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:underline"
              >
                Reset search
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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

      {/* CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Start a Project
            </p>

            <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Have a project in mind?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
              Whether you need brand identity, custom packaging, social templates,
              or VFX plate preparation, let&apos;s discuss the approach and timeline.
            </p>

            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
