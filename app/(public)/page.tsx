import {
  Eraser,
  Target,
  Scissors,
  MagicWand,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/home/hero/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryTile } from "@/components/home/CategoryTile";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { SectionLabel } from "@/components/motion/SectionLabel";
import { HoverLink } from "@/components/motion/HoverLink";
import { CtaButton } from "@/components/ui/CtaButton";
import { DURATION_SECTION, DURATION_MICRO } from "@/lib/motion";
import { getCategories } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";

export const dynamic = "force-dynamic";

const beforeItems = [
  { label: "Wire rigs", Icon: Eraser },
  { label: "Tracking markers", Icon: Target },
  { label: "Rough mattes", Icon: Scissors },
];

export default async function Home() {
  const [categoriesResult, featuredProjectsResult] = await Promise.all([
    getCategories({ pageSize: 8 }, true),
    getProjects({ filter: "featured", pageSize: 6 }, true),
  ]);

  const categories = categoriesResult.data?.categories ?? [];
  let featuredProjects = featuredProjectsResult.data?.projects ?? [];

  // Fallback to published projects if no featured projects found
  if (featuredProjects.length === 0) {
    const fallbackProjects = await getProjects({ pageSize: 6 }, true);
    featuredProjects = fallbackProjects.data?.projects ?? [];
  }

  const categorySlugMap: Record<string, string> = {};
  categories.forEach((cat) => {
    if (cat._id) categorySlugMap[String(cat._id)] = cat.slug;
  });

  return (
    <>
      {/* 1. Static Hero Section */}
      <Hero />

      {/* 2. Featured Work Section (Pinned Horizontal Scroll + Opposing Image Parallax) */}
      <FeaturedSection
        projects={featuredProjects}
        categorySlugMap={categorySlugMap}
      />

      {/* 3. Category Overview Section */}
      {categories.length > 0 && (
        <section className="bg-surface/60 border-b border-line py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <ClipReveal direction="right" delay={0.02}>
                  <SectionLabel>DISCIPLINES / 02</SectionLabel>
                </ClipReveal>
                <ClipReveal direction="right" delay={0.08}>
                  <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                    Explore by Category
                  </h2>
                </ClipReveal>
              </div>
              <ClipReveal direction="left" delay={0.12}>
                <HoverLink href="/work" className="font-sans text-sm font-semibold text-foreground">
                  <span>View all disciplines</span>
                  <ArrowRight weight="bold" />
                </HoverLink>
              </ClipReveal>
            </div>

            {/* StaggerGrid with left-to-right wipe (distinct from Featured Work's bottom-to-top) */}
            <StaggerGrid
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              direction="right"
            >
              {categories.slice(0, 4).map((category, index) => (
                <CategoryTile
                  key={category.slug}
                  category={category}
                  index={index}
                />
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* 4. About Teaser Section (Loose Section: single ClipReveal on whole text block, DURATION_SECTION) */}
      <section id="about" className="scroll-mt-28 bg-surface border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 items-start">
            <div>
              <ClipReveal direction="right" delay={0.02}>
                <SectionLabel>ABOUT / 03</SectionLabel>
              </ClipReveal>
              <ClipReveal direction="right" delay={0.08} duration={DURATION_SECTION}>
                <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  From raw brief or plate
                  <br />
                  <span className="text-foreground/45">
                    to clean, finished delivery.
                  </span>
                </h2>
              </ClipReveal>
            </div>

            {/* Single ClipReveal on the full text block as a unit, no stagger */}
            <ClipReveal direction="right" delay={0.12} duration={DURATION_SECTION}>
              <div className="space-y-8">
                <p className="font-sans text-lg leading-8 text-muted">
                  Detail-oriented Graphic Designer and Paint &amp; Roto artist with
                  hands-on experience in broadcast media, branding systems, and visual
                  effects production. Currently a Graphic Designer at ETV Network,
                  delivering tailored visual solutions for studios, products, and brands.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {beforeItems.map(({ label, Icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-surface-2 px-4 py-2 text-sm font-medium text-muted line-through decoration-foreground/25"
                    >
                      <Icon weight="bold" className="shrink-0 text-foreground/30" />
                      {label}
                    </span>
                  ))}

                  <ArrowRight
                    weight="bold"
                    className="mx-1 shrink-0 text-foreground/25"
                    aria-hidden="true"
                  />

                  <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
                    <MagicWand weight="bold" className="shrink-0" />
                    Polished, delivered result
                  </span>
                </div>

                <div className="pt-2">
                  <HoverLink
                    href="/about"
                    className="font-sans text-sm font-semibold text-foreground"
                  >
                    <span>Read more about my background &amp; experience</span>
                    <ArrowRight weight="bold" />
                  </HoverLink>
                </div>
              </div>
            </ClipReveal>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA Section (Deliberately quietest section: single fast ClipReveal on heading) */}
      <section id="contact" className="scroll-mt-28 bg-background text-foreground py-20 lg:py-28 border-b border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-4xl">
            <SectionLabel>
              CONNECT / 04
            </SectionLabel>

            {/* Single fast ClipReveal on heading only, DURATION_MICRO */}
            <ClipReveal direction="right" duration={DURATION_MICRO} delay={0.05}>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-foreground">
                Have a brand to design
                <br />
                <span className="text-foreground/45">
                  or footage that needs cleaning up?
                </span>
              </h2>
            </ClipReveal>

            <p className="mt-7 max-w-2xl font-sans text-lg leading-8 text-muted">
              Tell me about your project, timeline, and deliverables. I&apos;ll help
              you determine the right approach and scope.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <CtaButton href="/contact" variant="primary">
                Start Your Project
              </CtaButton>
              <CtaButton href="/contact" variant="ghost">
                Get In Touch
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
