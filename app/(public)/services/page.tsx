import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Custom Business Software",
    description:
      "Build the software your business actually needs instead of forcing your workflow into a generic product. We create purpose-built systems for unique business processes, operations, and customer experiences.",
  },
  {
    number: "02",
    title: "CRM Systems & Customer Portals",
    description:
      "Bring customer information, enquiries, follow-ups, appointments, communication, and account activity into one organized system designed around your customer journey.",
  },
  {
    number: "03",
    title: "Internal Tools & Dashboards",
    description:
      "Replace spreadsheets and fragmented internal processes with secure tools and dashboards that help your team manage operations, data, tasks, and reporting more effectively.",
  },
  {
    number: "04",
    title: "Web Applications",
    description:
      "Build secure, reliable web applications that customers, employees, or partners can use from anywhere.",
  },
  {
    number: "05",
    title: "Business Websites",
    description:
      "Professional, high-performance websites designed to represent your business clearly, attract the right customers, and provide a strong foundation for growth.",
  },
  {
    number: "06",
    title: "AI & Workflow Automation",
    description:
      "Automate repetitive work and connect disconnected processes using integrations, workflows, and AI where they create real business value.",
  },
  {
    number: "07",
    title: "Mobile Apps & MVPs",
    description:
      "Turn a product idea or business requirement into a focused mobile application or MVP that can be tested, improved, and grown over time.",
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
            Digital systems built around the way your business works.
          </h1>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            From a focused internal tool to a complete business platform, we
            build practical software that fits your workflow, connects your
            processes, and grows with your business.
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

                {/* Visual placeholder */}
                <div
                  className={`flex min-h-90 items-center justify-center bg-[#f4f4f2] ${isEven ? "lg:order-1" : "lg:order-2"
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
      <section className="bg-[#f4f4f2] text-foreground">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Let&apos;s Talk
            </p>

            <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Not sure what you need yet?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
              Start with the business problem, not the technology. Tell us what is
              taking too much time, creating friction, or holding your team back, and
              we can work out the right digital solution together.
            </p>

            <Link
              href="/contact"
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