import Link from "next/link";

const approachPoints = [
  {
    number: "01",
    title: "Understand first.",
    description:
      "We believe good software starts with listening. Clear requirements, transparent delivery, regular communication, and feedback throughout development help turn complex business needs into systems people can actually use.",
  },
  {
    number: "02",
    title: "Build with purpose.",
    description:
      "We are not interested in building software simply because it can be built. The goal is to make your business easier to run, more organized, and better prepared to grow.",
  },
  {
    number: "03",
    title: "Support for the long term.",
    description:
      "We work closely with businesses to understand how they operate, identify where technology can simplify the work, and build solutions around their actual workflow.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            About KreatenVibe
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Technology should make business simpler, not more complicated.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            {/* Section heading */}
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                About
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Building useful things, solving real problems.
              </h2>
            </div>

            {/* Copy */}
            <div className="space-y-8 font-sans text-lg leading-8 text-white/70">
              <p>
                KreatenVibe exists to help growing businesses build better
                digital systems without forcing them into one-size-fits-all
                software.
              </p>

              <p>
                The name comes from K—Koushik—and the idea of creating with a
                vibe: building useful things, solving real problems, and
                turning ideas into working software.
              </p>

              <p>
                We work closely with businesses to understand how they
                operate, identify where technology can simplify the work, and
                build solutions around their actual workflow.
              </p>

              <p>
                That may mean a CRM, a customer portal, an internal dashboard,
                a billing system, a web application, a business website, or a
                connected set of tools and automations.
              </p>

              <p className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                The technology is important, but the business problem comes
                first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-4xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Our Approach
          </p>

          <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Understand first. Build with purpose. Support for the long term.
          </h2>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-3 lg:gap-16">
          {approachPoints.map((point) => (
            <article key={point.number}>
              <span className="font-heading text-5xl font-bold text-accent">
                {point.number}
              </span>

              <h3 className="mt-6 font-heading text-2xl font-semibold">
                {point.title}
              </h3>

              <p className="mt-4 font-sans leading-7 text-muted">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Let&apos;s Build
              </p>

              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Ready to build something useful?
              </h2>
            </div>

            <Link
              href="/contact"
              className="inline-flex w-fit shrink-0 rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}