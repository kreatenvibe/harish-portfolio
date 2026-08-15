import { Eyebrow } from "../components/eyebrow";
import { CtaButton } from "../components/cta-button";
import { FaqAccordion } from "../components/faq-accordion";

const services = [
  {
    title: "Custom Business Software",
    description:
      "Purpose-built applications for the processes that make your business unique.",
  },
  {
    title: "CRM & Customer Portals",
    description:
      "Keep customer information, enquiries, communication, and follow-ups organized in one place.",
  },
  {
    title: "Internal Tools & Dashboards",
    description:
      "Give your team a clearer way to manage operations, data, tasks, and reporting.",
  },
  {
    title: "Web Applications",
    description:
      "Secure, scalable applications that customers or employees can use from anywhere.",
  },
  {
    title: "Business Websites",
    description:
      "Professional, high-performance websites designed to represent your business and support growth.",
  },
  {
    title: "AI & Workflow Automation",
    description:
      "Reduce repetitive work by connecting systems and automating the processes that slow your team down.",
  },
  {
    title: "Mobile Apps & MVPs",
    description:
      "Turn a business idea or customer experience into a practical mobile product.",
  },
];

const benefits = [
  "Replace scattered tools with one connected system.",
  "Reduce repetitive manual work and unnecessary data entry.",
  "Keep customer and business information organized in one place.",
  "Automate follow-ups, notifications, appointments, and routine workflows.",
  "Give your team clearer processes and better visibility.",
  "Build systems that can evolve as your business grows.",
  "Make better decisions with centralized information and dashboards.",
];

const steps = [
  {
    number: "01",
    title: "Understand",
    description: "Learn how your business works and define clear requirements.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Turn the requirements into a practical roadmap with clear priorities and milestones.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Develop the solution in milestones, with regular demos so you always know where the project stands.",
  },
  {
    number: "04",
    title: "Refine",
    description:
      "Gather your feedback throughout development and improve the system based on what you need.",
  },
  {
    number: "05",
    title: "Launch & Support",
    description:
      "Deploy the solution securely and continue supporting it as your business evolves.",
  },
];

const supportingPoints = [
  "Business-first thinking",
  "Clear communication",
  "Transparent delivery",
  "Software designed around your workflow",
  "Secure deployment",
  "Long-term support",
];

const faqs = [
  {
    question: "What kind of software can KreatenVibe build?",
    answer:
      "We build custom business software around the way your company works. This can include CRM systems, customer portals, billing systems, internal dashboards, web applications, business management platforms, workflow automation, and mobile applications.",
  },
  {
    question: "Why not use an off-the-shelf tool?",
    answer:
      "Generic software can be a great starting point, but growing businesses sometimes reach a point where the software no longer matches their workflow. If your team is constantly working around limitations, moving data between tools, or maintaining manual processes, a custom system may be a better fit.",
  },
  {
    question: "Do you only build software from scratch?",
    answer:
      "Not necessarily. We look at the business problem first. Depending on the requirements, the right solution may involve custom software, integrations, automation, existing services, or a combination of these.",
  },
  {
    question: "Can you automate our existing business processes?",
    answer:
      "Yes. We can identify repetitive or disconnected workflows and use integrations, workflow automation, and AI-powered automation where they provide a practical benefit.",
  },
  {
    question: "Can you build a CRM specifically for our business?",
    answer:
      "Yes. A custom CRM can be designed around your actual customer journey, sales process, follow-ups, appointments, communication, and reporting instead of forcing your team into a generic workflow.",
  },
  {
    question: "Will you support the system after launch?",
    answer:
      "Yes. Ongoing support is part of the way we approach client relationships. After deployment, we can continue helping you maintain, improve, and extend the system as your business grows.",
  },
  {
    question: "How does a project start?",
    answer:
      "Every project starts with a conversation about your business, your current processes, and what you want to improve. From there, we define the requirements and determine the right solution and roadmap.",
  },
  {
    question:
      "Do I need to know exactly what software I want before contacting you?",
    answer:
      "No. You can start with the business problem. If you know that your team is spending too much time on manual work, using too many disconnected tools, or struggling with an existing process, we can help define what the right digital solution should look like.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Eyebrow>Custom Business Software</Eyebrow>

          <h1 className="mt-7 max-w-3xl font-heading text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl">
            Software that fits your business.
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
            Stop piecing your business together with spreadsheets,
            WhatsApp, and manual work. We build the system that fits how
            you actually operate.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <CtaButton href="#contact" variant="primary">
              Start Your Project
            </CtaButton>
            <CtaButton href="#contact" variant="ghost">
              Discuss Your Business Needs
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="about" className="scroll-mt-28 bg-[#F7F6F3]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <Eyebrow>Why Custom Software</Eyebrow>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Your business is unique. Your software should be too.
              </h2>
            </div>

            <p className="text-lg leading-8 text-muted">
              As you grow, the tools that once worked start getting in the
              way—customer info in spreadsheets, enquiries in WhatsApp,
              invoices done by hand. KreatenVibe brings it together into
              one system built around how you actually work.
            </p>
          </div>
        </div>
      </section>

      {/* Core Offer */}
      <section id="services" className="scroll-mt-28">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>What We Build</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Custom business systems, built around your workflow.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Built around your requirements—not a generic template.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {services.map((service, index) => (
              <li key={service.title} className="border-t border-foreground/10 pt-5">
                <span className="text-sm font-semibold text-accent">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 leading-7 text-muted">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F7F6F3]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <Eyebrow>The Difference</Eyebrow>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Less manual work. More control over your business.
              </h2>
            </div>

            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="border-b border-foreground/10 pb-4 text-lg leading-7 text-foreground"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              A clear process from idea to working system.
            </h2>
          </div>

          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <li key={step.number} className="border-t border-foreground/10 pt-5">
                <span className="text-sm font-semibold text-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why KreatenVibe */}
      <section className="bg-[#F7F6F3]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <Eyebrow>Why KreatenVibe</Eyebrow>
              <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                Built around your business. Delivered with clarity.
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-muted">
                We do not sell one-size-fits-all software. We work closely
                with you to understand your processes and support you from
                planning to deployment—not generic templates.
              </p>

              <ul className="mt-8 flex flex-wrap gap-3">
                {supportingPoints.map((point) => (
                  <li key={point}>
                    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-semibold text-foreground">
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
              Built for real business problems.
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
          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-end lg:gap-12">
            <Eyebrow>FAQ</Eyebrow>

            <h2 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Common questions, answered.
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
              Ready to build a system that works the way your business
              does?
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Tell us how your business works today and what you want to
              improve. We will help you figure out the rest.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <CtaButton href="#contact" variant="accent">
                Start Your Project
              </CtaButton>
              <CtaButton href="#contact" variant="ghost-dark">
                Discuss Your Business Needs
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
