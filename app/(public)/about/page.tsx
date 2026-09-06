import Link from "next/link";

const approachPoints = [
  {
    number: "01",
    title: "Look closely first.",
    description:
      "Whether it's a plate that needs a wire removed or a brand that needs a logo, the work starts with understanding exactly what's needed and what “clean” or “on-brand” looks like for that project.",
  },
  {
    number: "02",
    title: "Work with purpose.",
    description:
      "Every pass on a plate and every design decision should earn its place. The goal is a result that holds up under close review, not just something that looks finished at a glance.",
  },
  {
    number: "03",
    title: "Stay collaborative.",
    description:
      "Good VFX and design work rarely happens in isolation. I share progress early, take feedback from senior artists and clients seriously, and adjust rather than defend a first pass.",
  },
];

const experience = [
  {
    role: "Graphic Designer",
    org: "ETV Network",
    period: "2026 — Feb",
    description:
      "Creating visually engaging designs for broadcast and digital platforms, alongside freelance Paint & Roto work on web series productions.",
  },
  {
    role: "Paint & Roto Artist",
    org: "Mantrick Studios",
    period: "2025 — 1 year",
    description:
      "Paint prep and rotoscopy work — clean plates, wire removals, and accurate roto mattes, collaborating with senior artists to improve workflow and shot efficiency.",
  },
  {
    role: "Graphic Designer",
    org: "Freelancing",
    period: "2019 — 2025",
    description:
      "Branding assets, posters, and visual materials for a range of clients, matching each brand's identity and improving their visual communication.",
  },
  {
    role: "Game Developer",
    org: "APSSDC",
    period: "2018 — 2019",
    description:
      "Gameplay features, core programming, and 2D art assets, working within a team to deliver functional game content.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            About Harish
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Detail-driven work, whichever the medium.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="bg-surface text-foreground border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            {/* Section heading */}
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                About
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl text-foreground">
                Harish Kumar G
              </h2>
            </div>

            {/* Copy */}
            <div className="space-y-8 font-sans text-lg leading-8 text-muted">
              <p>
                I&apos;m a Paint &amp; Roto artist and graphic designer with
                hands-on experience across broadcast media, VFX production,
                and freelance design and web series work.
              </p>

              <p>
                I&apos;m currently working as a Graphic Designer at ETV
                Network, while continuing to take on freelance Paint &amp;
                Roto projects — delivering clean plates, precise roto mattes,
                and high-quality visual output.
              </p>

              <p>
                My background spans animation, VFX, and even game
                development, which gives me a blend of technical discipline
                and creative range that I bring to every project, whether
                it&apos;s frame-by-frame cleanup work or a brand identity
                built from the ground up.
              </p>

              <p className="font-heading text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                I&apos;m committed to producing visually compelling work and
                continuously growing within the VFX and design industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32 border-b border-line">
        <div className="max-w-4xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Experience
          </p>

          <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            From broadcast VFX to brand design.
          </h2>
        </div>

        <div className="mt-16 divide-y divide-foreground/10 border-t border-foreground/10">
          {experience.map((item) => (
            <div
              key={`${item.role}-${item.org}`}
              className="grid gap-2 py-8 sm:grid-cols-[1fr_2fr] sm:gap-8"
            >
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  {item.role}
                </p>
                <p className="mt-1 font-sans text-sm text-muted">
                  {item.org} · {item.period}
                </p>
              </div>
              <p className="font-sans leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="bg-surface border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Our Approach
            </p>

            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Look closely first. Work with purpose. Stay collaborative.
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Let&apos;s Work Together
              </p>

              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Have a project in mind?
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
