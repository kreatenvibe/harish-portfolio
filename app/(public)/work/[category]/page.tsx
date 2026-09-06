import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";
import ProjectCard from "@/components/cards/ProjectCard";
import FilterBar from "@/components/filters/FilterBar";

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
    title: `${category.name} — Work`,
    description:
      category.description ||
      `Explore selected ${category.name} projects by Harish Kumar G.`,
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
    <main className="bg-background text-foreground">
      {/* Hero & Breadcrumb */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8 lg:pb-20 lg:pt-32">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center font-sans text-sm font-semibold uppercase tracking-[0.15em] text-muted"
        >
          <Link
            href="/work"
            className="transition-colors hover:text-foreground"
          >
            Work
          </Link>
          <span className="mx-3 text-foreground/20">/</span>
          <span className="text-accent">{category.name}</span>
        </nav>

        <div className="max-w-4xl">
          <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-muted sm:text-xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Secondary Filter Bar */}
        {(tagFilters.length > 0 || query) && (
          <div className="mt-12">
            <FilterBar
              filters={tagFilters}
              searchPlaceholder={`Search ${category.name.toLowerCase()}…`}
            />
          </div>
        )}
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-foreground/10 bg-surface/50 p-12 text-center">
            <p className="font-sans text-lg text-muted">
              {query || filter
                ? "No projects match your filter criteria."
                : `No ${category.name.toLowerCase()} projects published yet.`}
            </p>
            {(query || filter) && (
              <Link
                href={`/work/${category.slug}`}
                className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:underline"
              >
                Clear filters
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
                categorySlug={category.slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Start a Project
            </p>

            <h2 className="mt-6 font-heading text-4xl font-bold leading-[1] tracking-tight sm:text-5xl lg:text-6xl">
              Need {category.name.toLowerCase()} for your brand or studio?
            </h2>

            <p className="mt-6 max-w-2xl font-sans text-lg leading-8 text-muted">
              Let&apos;s discuss your requirements, timeline, and how we can
              bring high quality and attention to detail to your project.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
