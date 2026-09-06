import Link from "next/link";
import {
  Eraser,
  Target,
  Scissors,
  MagicWand,
  ArrowRight,
  FilmSlate,
  PaintBrush,
  Palette,
  PenNib,
  ClockCountdown,
  ChatCircleText,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaButton } from "@/components/ui/CtaButton";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Hero } from "@/components/home/hero/Hero";
import ProjectCard from "@/components/cards/ProjectCard";
import { getCategories } from "@/lib/actions/category.action";
import { getProjects } from "@/lib/actions/project.action";

export const dynamic = "force-dynamic";

const capabilities = [
  {
    number: "01",
    title: "Brand Identity & Systems",
    description:
      "Logo systems, typography rules, color palettes, and comprehensive brand guidelines built for real-world consistency.",
  },
  {
    number: "02",
    title: "Packaging & Label Design",
    description:
      "Product packaging, cartons, pouches, and bottle labels engineered for shelf presence and production tolerances.",
  },
  {
    number: "03",
    title: "Social Media Systems",
    description:
      "Grid systems, carousel templates, campaign creatives, and ad suites designed for brand consistency and engagement.",
  },
  {
    number: "04",
    title: "Print Collateral & Editorial",
    description:
      "Brochures, posters, catalogues, menus, and business stationery prepared meticulously for print production.",
  },
  {
    number: "05",
    title: "Paint & Roto Prep",
    description:
      "Clean plates, wire & rig removals, tracking marker cleanup, and frame-accurate roto mattes for broadcast and film.",
  },
  {
    number: "06",
    title: "VFX Compositing Support",
    description:
      "Pipeline-ready prep work and shot cleanup that integrates seamlessly into studio visual effects workflows.",
  },
];

const beforeItems = [
  { label: "Wire rigs", Icon: Eraser },
  { label: "Tracking markers", Icon: Target },
  { label: "Rough mattes", Icon: Scissors },
];

const benefits = [
  {
    text: "Frame-accurate roto and paint work that holds up under close review.",
    Icon: FilmSlate,
  },
  {
    text: "A background in both VFX production and client graphic design.",
    Icon: PaintBrush,
  },
  {
    text: "Clean, brand-consistent design across every deliverable.",
    Icon: Palette,
  },
  {
    text: "Comfortable working inside an existing pipeline or brand system.",
    Icon: PenNib,
  },
  {
    text: "Reliable turnaround on tight production schedules.",
    Icon: ClockCountdown,
  },
  {
    text: "Clear communication and collaborative feedback throughout.",
    Icon: ChatCircleText,
  },
];

const steps = [
  {
    number: "01",
    title: "Brief",
    description: "Understand the footage, brand, or problem, and what a finished result looks like.",
  },
  {
    number: "02",
    title: "Reference",
    description: "Gather reference, plates, or brand material and agree on the approach.",
  },
  {
    number: "03",
    title: "Produce",
    description: "Do the paint, roto, or design work in focused passes, not one big rush.",
  },
  {
    number: "04",
    title: "Review",
    description: "Share progress early and adjust based on your feedback.",
  },
  {
    number: "05",
    title: "Deliver",
    description: "Hand off clean, production-ready files in the format you need.",
  },
];

const supportingPoints = [
  "Frame-accurate roto",
  "Clean, brand-consistent design",
  "Reliable turnaround",
  "Broadcast & freelance experience",
  "Collaborative feedback process",
  "Long-term working relationships",
];

const faqs = [
  {
    question: "What kind of work do you take on?",
    answer:
      "Two main areas: client graphic design (brand identity, packaging, social media, and print design) and paint & roto / VFX cleanup for broadcast and film production.",
  },
  {
    question: "What software do you work in?",
    answer:
      "Photoshop, Illustrator, After Effects, and Premiere Pro for design and motion work; Silhouette and Autodesk Maya for paint, roto, and VFX prep.",
  },
  {
    question: "Do you work with studios or individual clients?",
    answer:
      "Both. I currently work as a Graphic Designer at ETV Network and take on freelance design and VFX projects for production studios, independent filmmakers, and businesses.",
  },
  {
    question: "How does a project usually start?",
    answer:
      "With a conversation about the footage or design brief — what needs creating or cleaning up, what the brand needs to communicate, and the deadline. From there I'll provide a clear roadmap and timeline.",
  },
  {
    question: "Can you work within an existing pipeline or brand system?",
    answer:
      "Yes. For VFX, I follow established paint/roto pipeline specs. For design, I strictly adhere to existing brand guidelines when provided.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes. Feedback milestones are built into every phase of the process to ensure alignment before final delivery.",
  },
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

      {/* 2. Category Overview (4 Tiles) */}
      {categories.length > 0 && (
        <section className="bg-surface/60 border-y border-foreground/10 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <Eyebrow>Design Disciplines</Eyebrow>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Explore by Category
                </h2>
              </div>
              <Link
                href="/work"
                className="font-sans text-sm font-semibold text-accent hover:underline flex items-center gap-2"
              >
                View all projects <ArrowRight weight="bold" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/work/${category.slug}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-foreground/10 bg-surface p-7 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-accent">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 font-heading text-2xl font-bold text-foreground transition-colors group-hover:text-accent">
                      {category.name}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-6 text-muted">
                      {category.description ||
                        `Browse client work and case studies in ${category.name.toLowerCase()}.`}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-foreground/70 transition-colors group-hover:text-accent">
                    <span>Explore projects</span>
                    <ArrowRight weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <Eyebrow>Portfolio Highlights</Eyebrow>
                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  Featured Client Work
                </h2>
              </div>
              <CtaButton href="/work" variant="ghost">
                View All Work
              </CtaButton>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
              {featuredProjects.slice(0, 4).map((project, index) => (
                <ProjectCard
                  key={String(project._id)}
                  project={project}
                  index={index}
                  categorySlug={categorySlugMap[String(project.categoryId)]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. About teaser */}
      <section id="about" className="scroll-mt-28 bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <Eyebrow>Two Crafts, One Eye for Detail</Eyebrow>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                From raw brief or plate
                <br />
                <span className="text-foreground/45">
                  to clean, finished delivery.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-muted">
                Detail-oriented Graphic Designer and Paint &amp; Roto artist with
                hands-on experience in broadcast media, branding systems, and visual
                effects production. Currently a Graphic Designer at ETV Network,
                delivering tailored visual solutions for studios, products, and brands.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
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

              <div className="mt-8">
                <Link
                  href="/about"
                  className="font-sans text-sm font-semibold text-accent hover:underline flex items-center gap-2"
                >
                  Read more about my background <ArrowRight weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Capabilities & Services (Folded from /services) */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Capabilities</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Design &amp; VFX capabilities,
              <br />
              <span className="text-foreground/45">
                built around your project.
              </span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              From standalone brand identity systems to precision roto passes.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-foreground/10 bg-surface p-7 transition-colors hover:border-foreground/20"
              >
                <span className="font-heading text-sm font-bold text-accent">
                  {item.number}
                </span>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Benefits */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/50">
                <span>01</span>
                <span className="h-px w-8 bg-foreground/20" />
                <span>The Difference</span>
              </div>

              <h2 className="mt-7 max-w-xl font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                Careful work.
                <br />
                <span className="text-foreground/45">
                  Delivered on time.
                </span>
              </h2>
            </div>

            <ul className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              {benefits.map(({ text, Icon }) => (
                <li key={text} className="group flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-surface-2 text-foreground/55 shadow-sm transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    <Icon weight="bold" className="h-5 w-5" />
                  </span>

                  <p className="text-[1.05rem] leading-7 text-foreground/85">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. How It Works */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/50">
              <span>02</span>
              <span className="h-px w-8 bg-foreground/20" />
              <span>How It Works</span>
            </div>

            <h2 className="mt-7 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              A clear process from brief
              <br />
              <span className="text-foreground/45">
                to finished delivery.
              </span>
            </h2>
          </div>

          <ol className="mt-16 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="relative border-t border-foreground/10 py-6 lg:border-t-0 lg:py-0 lg:pr-8"
              >
                {index < steps.length - 1 && (
                  <span className="absolute left-0 right-8 top-4.25 hidden h-px bg-foreground/10 lg:block" />
                )}

                <div className="relative flex items-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-background text-xs font-semibold text-foreground">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Why HK Designs */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/50">
                <span>03</span>
                <span className="h-px w-8 bg-foreground/20" />
                <span>Why Work With Me</span>
              </div>
              <h2 className="mt-7 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                Built on attention to detail.
                <br />
                <span className="text-foreground/45">
                  Delivered with clarity.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-foreground/85">
                I bring a background across client graphic design and VFX
                production, so whether the work is a brand identity for a new
                business or a complex roto pass for a broadcast deadline, it
                receives the same methodical care from brief to delivery.
              </p>

              <ul className="mt-10 flex flex-wrap gap-3">
                {supportingPoints.map((point) => (
                  <li key={point}>
                    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="scroll-mt-28">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Common questions,
              <br />
              <span className="text-foreground/45">answered.</span>
            </h2>
          </div>

          <div className="mt-12">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* 10. Final CTA */}
      <section id="contact" className="scroll-mt-28 bg-accent text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Eyebrow tone="dark">Start a Conversation</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Have a brand to design
              <br />
              <span className="text-white/70">
                or footage that needs cleaning up?
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Tell me about your project, timeline, and deliverables. I&apos;ll help
              you determine the right approach and scope.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <CtaButton href="/contact" variant="accent">
                Start Your Project
              </CtaButton>
              <CtaButton href="/contact" variant="ghost-dark">
                Get In Touch
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
