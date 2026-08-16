import Link from "next/link";

const projects = [
  {
    number: "01",
    name: "Business Management System",
    label: "Product Experiment",
  },
  {
    number: "02",
    name: "CRM & Customer Management",
    label: "Product Experiment",
  },
  {
    number: "03",
    name: "Inventory & Billing Platform",
    label: "Product Experiment",
  },
];

export default function WorkPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Work
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Practical software for real business workflows.
          </h1>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            Every project starts with a business problem. We turn complex
            processes into reliable digital systems that are easier to manage,
            easier to use, and ready to grow.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        <div className="space-y-24 lg:space-y-40">
          {projects.map((project, index) => (
            <article
              key={project.number}
              className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-24"
            >
              {/* Project visual */}
              <div
                className={`flex min-h-[400px] items-center justify-center bg-[#f4f4f2] ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                  }`}
              >
                <div className="text-center">
                  <span className="font-heading text-7xl font-bold text-accent/20">
                    {project.number}
                  </span>

                  <p className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-muted">
                    {project.label}
                  </p>
                </div>
              </div>

              {/* Project information */}
              <div className={index % 2 === 1 ? "lg:order-1" : "lg:order-2"}>
                <span className="font-heading text-5xl font-bold text-accent">
                  {project.number}
                </span>

                <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-accent">
                  {project.label}
                </p>

                <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                  {project.name}
                </h2>

                <div className="mt-10 space-y-8">
                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      The challenge
                    </h3>

                    <p className="mt-2 font-sans leading-7 text-muted">
                      What was difficult, manual, disconnected, or inefficient
                      before the project?
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      What we built
                    </h3>

                    <p className="mt-2 font-sans leading-7 text-muted">
                      What system, application, website, CRM, dashboard, or
                      automation was created?
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      How it works
                    </h3>

                    <p className="mt-2 font-sans leading-7 text-muted">
                      Explain the important workflow in simple business
                      language.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      The outcome
                    </h3>

                    <p className="mt-2 font-sans leading-7 text-muted">
                      Use only verified results. Include time saved, reduced
                      manual work, improved response time, increased visibility,
                      or another measurable result only when it is genuinely
                      known.
                    </p>
                  </div>
                </div>

                <Link
                  href="/#contact"
                  className="mt-10 inline-flex rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white"
                >
                  Discuss Your Business Needs
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Start a Project
            </p>

            <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Have a business problem worth solving?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
              Tell us what is taking too much time, creating friction, or
              holding your team back. We can help you work out the right
              digital solution.
            </p>

            <Link
              href="/#contact"
              className="mt-10 inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white"
            >
              Discuss Your Business Needs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}