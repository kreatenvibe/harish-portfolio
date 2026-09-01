import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Paint & Roto",
    description:
      "Clean plates, wire and rig removal, and precise roto mattes for broadcast and film production, done to hold up under close review.",
  },
  {
    number: "02",
    title: "VFX Cleanup & Compositing Support",
    description:
      "Paint prep and cleanup work that fits into an existing VFX pipeline, delivered to spec and on schedule.",
  },
  {
    number: "03",
    title: "Brand Identity & Logo Design",
    description:
      "Logo systems, visual identity, and brand guidelines built to represent a business clearly and hold up across every touchpoint.",
  },
  {
    number: "04",
    title: "Packaging Design",
    description:
      "Product and packaging artwork that stands out on shelf while staying true to the brand it belongs to.",
  },
  {
    number: "05",
    title: "Social Media Design",
    description:
      "Templates and creatives that keep a brand consistent, on-message, and scroll-stopping across platforms.",
  },
  {
    number: "06",
    title: "Print Design",
    description:
      "Posters, brochures, and print collateral designed with real-world production and printing in mind.",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
        <div className="max-w-5xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Services
          </p>

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            VFX and design work, done with care.
          </h1>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            From a single roto pass to a complete brand identity, I bring the
            same close attention to detail to every project — for production
            studios, filmmakers, and businesses alike.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
        <div>
          {services.map((service, index) => {
            const isEven = index % 2 === 1;

            return (
              <article
                key={service.number}
                className="grid min-h-130 items-center gap-12 py-20 lg:grid-cols-2 lg:gap-24 lg:py-28"
              >
                {/* Content */}
                <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                  <span className="font-heading text-5xl font-bold text-accent">
                    {service.number}
                  </span>

                  <h2 className="mt-8 max-w-xl font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                    {service.title}
                  </h2>

                  <p className="mt-6 max-w-xl font-sans text-lg leading-8 text-muted">
                    {service.description}
                  </p>
                </div>

                {/* Visual placeholder — swap for real work samples once available */}
                <div
                  className={`flex relative min-h-90 items-center justify-center bg-surface overflow-hidden ${isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                >
                  <span className="font-heading text-2xl font-semibold text-foreground/20">
                    {service.title}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-surface text-foreground">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Let&apos;s Talk
            </p>

            <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Not sure which service you need?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
              Start with the project, not the category. Tell me what you&apos;re
              working on — footage that needs cleanup, a brand that needs
              designing — and we can figure out the right approach together.
            </p>

            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}