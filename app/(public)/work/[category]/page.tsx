import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";
import ProjectCard from "@/components/cards/ProjectCard";
import FilterBar from "@/components/filters/FilterBar";
import { FrameCounter } from "@/components/frame/FrameCounter";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ query?: string; filter?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const result = await getCategoryBySlug(categorySlug);

  if (!result.success || !result.data || !result.data.isActive) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const category = result.data;
  return {
    title: `${category.name} — Work Archive`,
    description:
      category.description ||
      `Explore selected ${category.name} portfolio plates by Harish Kumar G.`,
  };
}

export default async function CategoryWorkPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { query, filter } = await searchParams;

  const categoryResult = await getCategoryBySlug(categorySlug);
  if (
    !categoryResult.success ||
    !categoryResult.data ||
    !categoryResult.data.isActive
  ) {
    notFound();
  }

  const category = categoryResult.data;

  const projectsResult = await getProjects(
    {
      categoryId: String(category._id),
      query: query || undefined,
      pageSize: 100,
    },
    true
  );

  let projects = projectsResult.data?.projects ?? [];

  // Extract unique tags for secondary filter
  const allCategoryProjectsResult = await getProjects(
    { categoryId: String(category._id), pageSize: 100 },
    true
  );
  const allCategoryProjects = allCategoryProjectsResult.data?.projects ?? [];
  const uniqueTags = Array.from(
    new Set(allCategoryProjects.flatMap((p) => p.tags || []))
  ).filter(Boolean);

  const tagFilters = uniqueTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  // Apply secondary tag filter if selected
  if (filter) {
    projects = projects.filter((p) =>
      p.tags?.some((t) => t.toLowerCase() === filter.toLowerCase())
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Category Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-12 lg:px-8 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl space-y-6">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted"
          >
            <Link
              href="/work"
              className="transition-colors hover:text-foreground"
            >
              [ WORK ARCHIVE ]
            </Link>
            <span className="text-line">/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <FrameCounter index="02" total={7} label={`DISCIPLINE // ${category.name}`} />

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
              {category.name}
            </h1>

            {category.description && (
              <p className="font-sans text-base sm:text-lg leading-relaxed text-muted max-w-2xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Secondary Filter Bar */}
          {(tagFilters.length > 0 || query) && (
            <div className="pt-6">
              <FilterBar
                filters={tagFilters}
                searchPlaceholder={`Search within ${category.name.toLowerCase()}…`}
              />
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        {projects.length === 0 ? (
          <div className="relative rounded border border-line bg-surface p-16 text-center space-y-4">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              NO PLATES PUBLISHED
            </p>
            <p className="font-sans text-base text-muted">
              {query || filter
                ? "No projects match your current filter criteria."
                : `No ${category.name.toLowerCase()} projects are currently published.`}
            </p>
            {(query || filter) && (
              <Link
                href={`/work/${category.slug}`}
                className="inline-block rounded border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-white/40"
              >
                Clear Search Filters
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
                categorySlug={category.slug}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
