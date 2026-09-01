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
import { ShowcaseStack } from "@/components/sections/ShowcaseStack";

const services = [
  {
    title: "Paint & Roto",
    description:
      "Clean plates, wire and rig removal, and precise roto mattes for broadcast and film production.",
  },
  {
    title: "VFX Cleanup",
    description:
      "Frame-accurate paint prep and compositing support that holds up under close review.",
  },
  {
    title: "Brand Identity & Logo Design",
    description:
      "Logo systems, visual identity, and brand guidelines built to hold up across every touchpoint.",
  },
  {
    title: "Packaging Design",
    description:
      "Packaging and product artwork that stands out on a shelf and stays true to the brand.",
  },
  {
    title: "Social Media Design",
    description:
      "Templates and creatives that keep a brand consistent and scroll-stopping across platforms.",
  },
  {
    title: "Print Design",
    description:
      "Posters, brochures, and print collateral designed for real-world production.",
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
    text: "A background in both VFX production and graphic design.",
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
    text: "Clear communication and feedback throughout the project.",
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
      "Two main areas: paint & roto / VFX cleanup for broadcast and film production, and graphic design work — brand identity, packaging, social media, and print. If you're not sure which category your project falls into, just describe it and I'll let you know.",
  },
  {
    question: "What software do you work in?",
    answer:
      "Silhouette and Autodesk Maya for paint, roto, and VFX work; Photoshop, Illustrator, After Effects, and Premiere Pro for design and motion work.",
  },
  {
    question: "Do you work with studios or individual clients?",
    answer:
      "Both. I currently work as a Graphic Designer at ETV Network and take on freelance paint & roto and design projects alongside that — for production studios, independent filmmakers, and businesses that need brand or print design.",
  },
  {
    question: "How does a project usually start?",
    answer:
      "With a conversation about the footage or brief — what needs cleaning up, what the brand needs to communicate, and what the deadline looks like. From there I'll give you a realistic turnaround.",
  },
  {
    question: "Can you work within an existing pipeline or brand system?",
    answer:
      "Yes. For VFX work, I can follow an existing paint/roto pipeline and delivery spec. For design work, I can work within existing brand guidelines rather than starting from scratch.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "For VFX: the plates, any reference for wire/rig removal, and the delivery spec. For design: a brief, any existing brand assets, and examples of styles you like.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes. Feedback rounds are built into the process — I'd rather adjust early than deliver something that misses the mark.",
  },
  {
    question: "Can you work remotely?",
    answer:
      "Yes, all of my freelance work is handled remotely, with files shared and reviewed online.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div>
              <Eyebrow>Paint & Roto Artist · Graphic Designer</Eyebrow>

              <h1 className="mt-7 max-w-3xl font-heading text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl">
                Precision in every frame, character in every brand.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
                I&apos;m Harish Kumar G — clean plates and roto mattes for
                broadcast and film, and brand identity, packaging, and print
                design for studios and businesses.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <CtaButton href="/work" variant="primary">
                  View My Work
                </CtaButton>
                <CtaButton href="/contact" variant="ghost">
                  Get In Touch
                </CtaButton>
              </div>
            </div>

            <div className="mx-auto shrink-0 lg:mx-0">
              <ShowcaseStack />
            </div>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section id="about" className="scroll-mt-28 bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <Eyebrow>Two Crafts, One Eye for Detail</Eyebrow>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                From raw plate
                <br />
                <span className="text-foreground/45">
                  to clean, finished frame.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-muted">
                Detail-oriented Paint &amp; Roto artist and graphic designer
                with hands-on experience in broadcast media, VFX production,
                and freelance design work. Currently a Graphic Designer at ETV
                Network, and a freelance Paint &amp; Roto artist delivering
                clean plates, precise mattes, and high-quality visual output.
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
                  Clean, delivered plate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offer */}
      <section id="services" className="scroll-mt-28">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>What I Do</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              VFX and design work,
              <br />
              <span className="text-foreground/45">
                built around your project.
              </span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              From a single roto pass to a full brand identity.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <li
                key={service.title}
                className="build-tile border border-foreground/10 p-7"
              >
                <span className="text-sm font-semibold text-accent">
                  0{index + 1}
                </span>
                <h3 className="build-tile-title mt-3 font-heading text-2xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="build-tile-desc mt-3 leading-7 text-muted">
                  {service.description}
                </p>
                <span className="build-tile-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">

            {/* Heading */}
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

            {/* Benefits */}
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

      {/* How It Works */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          {/* Header */}
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

          {/* Steps */}
          <ol className="mt-16 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="relative border-t border-foreground/10 py-6 lg:border-t-0 lg:py-0 lg:pr-8"
              >
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <span className="absolute left-0 right-8 top-4.25 hidden h-px bg-foreground/10 lg:block" />
                )}

                {/* Step number */}
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

      {/* Why HK Designs */}
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
                I bring a background in both VFX production and graphic
                design, so whether the work is a roto pass for a broadcast
                deadline or a brand identity for a new business, it gets the
                same close attention from brief to delivery.
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

      {/* Selected Work */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Selected Work</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              A look at recent VFX and design projects.
            </h2>
            <div className="mt-8">
              <CtaButton href="/work" variant="ghost">
                View Selected Work
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Final CTA */}
      <section id="contact" className="scroll-mt-28 bg-accent text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Eyebrow tone="dark">Start a Conversation</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Have footage to clean up
              <br />
              <span className="text-white/70">
                or a brand that needs designing?
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Tell me about the project and the deadline you&apos;re working
              with. I&apos;ll help you figure out the rest.
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
