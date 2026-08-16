import {
  Table,
  WhatsappLogo,
  Receipt,
  ArrowRight,
  Stack,
  ArrowsClockwise,
  FolderSimple,
  BellRinging,
  Eye,
  TrendUp,
  ChartBar,
} from "@phosphor-icons/react/dist/ssr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaButton } from "@/components/ui/CtaButton";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ShowcaseStack } from "@/components/sections/ShowcaseStack";

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

const scatteredTools = [
  { label: "Spreadsheets", Icon: Table },
  { label: "WhatsApp", Icon: WhatsappLogo },
  { label: "Manual invoices", Icon: Receipt },
];

const benefits = [
  {
    text: "Replace scattered tools with one connected system.",
    Icon: Stack,
  },
  {
    text: "Reduce repetitive manual work and unnecessary data entry.",
    Icon: ArrowsClockwise,
  },
  {
    text: "Keep customer and business information organized in one place.",
    Icon: FolderSimple,
  },
  {
    text: "Automate follow-ups, notifications, appointments, and routine workflows.",
    Icon: BellRinging,
  },
  {
    text: "Give your team clearer processes and better visibility.",
    Icon: Eye,
  },
  {
    text: "Build systems that can evolve as your business grows.",
    Icon: TrendUp,
  },
  {
    text: "Make better decisions with centralized information and dashboards.",
    Icon: ChartBar,
  },
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
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div>
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
                <CtaButton href="/contact" variant="primary">
                  Start Your Project
                </CtaButton>
                <CtaButton href="/contact" variant="ghost">
                  Discuss Your Business Needs
                </CtaButton>
              </div>
            </div>

            <div className="mx-auto shrink-0 lg:mx-0">
              <ShowcaseStack />
            </div>
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
                Your business is unique.
                <br />
                <span className="text-foreground/45">
                  Your software should be too.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-muted">
                As you grow, the tools that once worked start getting in
                the way—customer info in spreadsheets, enquiries in
                WhatsApp, invoices done by hand. KreatenVibe brings it
                together into one system built around how you actually
                work.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {scatteredTools.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium text-muted line-through decoration-foreground/25"
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

                <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-white">
                  <Stack weight="bold" className="shrink-0" />
                  One connected system
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
            <Eyebrow>What We Build</Eyebrow>
            <h2 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Custom business systems,
              <br />
              <span className="text-foreground/45">
                built around your workflow.
              </span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">
              Built around your requirements—not a generic template.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <li key={service.title} className="build-tile p-7">
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
      <section className="bg-[#F7F6F3]">
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
                Less manual work.
                <br />
                <span className="text-foreground/45">
                  More control over your business.
                </span>
              </h2>
            </div>

            {/* Benefits */}
            <ul className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              {benefits.map(({ text, Icon }) => (
                <li key={text} className="group flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-white text-foreground/55 shadow-sm transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
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
              A clear process from idea
              <br />
              <span className="text-foreground/45">
                to working system.
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

      {/* Why KreatenVibe */}
      <section className="bg-[#F7F6F3]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/50">
                <span>03</span>
                <span className="h-px w-8 bg-foreground/20" />
                <span>Why KreatenVibe</span>
              </div>
              <h2 className="mt-7 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
                Built around your business.
                <br />
                <span className="text-foreground/45">
                  Delivered with clarity.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-foreground/85">
                We do not sell one-size-fits-all software. We work closely
                with you to understand your processes and support you from
                planning to deployment—not generic templates.
              </p>

              <ul className="mt-10 flex flex-wrap gap-3">
                {supportingPoints.map((point) => (
                  <li key={point}>
                    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm">
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
              Ready to build a system
              <br />
              <span className="text-white/70">
                that works the way your business does?
              </span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Tell us how your business works today and what you want to
              improve. We will help you figure out the rest.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <CtaButton href="/contact" variant="accent">
                Start Your Project
              </CtaButton>
              <CtaButton href="/contact" variant="ghost-dark">
                Discuss Your Business Needs
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
