import Link from "next/link";

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
      "Develop the solution in milestones, with regular progress updates and demos so you always know where the project stands.",
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
      "Deploy the solution securely and continue supporting it after launch as your business evolves.",
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

import { HeroSequence } from "../components/hero-sequence";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <HeroSequence />

      {/* Problem */}
      <section id="about" className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Why Custom Software
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Your business is unique. Your software should be too.
              </h2>
            </div>

            <div className="space-y-8 font-sans text-lg leading-8 text-white/70">
              <p>
                As a business grows, the tools that worked in the beginning can
                start getting in the way. Customer information ends up in
                spreadsheets, enquiries stay in WhatsApp, appointments are
                managed over phone calls, invoices are handled manually, and
                important information is spread across different systems.
              </p>

              <p>
                KreatenVibe brings those disconnected processes together. We
                understand how your business works, identify where software can
                make the biggest difference, and build a system around your
                workflow instead of asking you to change your business to fit
                generic software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Offer */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            What We Build
          </p>

          <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Custom business systems, built around your workflow.
          </h2>

          <p className="mt-6 font-sans text-lg leading-8 text-muted">
            Whether you need a customer portal, billing system, CRM, internal
            dashboard, or a complete business platform, we build software
            around your requirements—not around a generic template.
          </p>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title}>
              <span className="font-sans text-sm font-semibold text-accent">
                0{index + 1}
              </span>

              <h3 className="mt-5 font-heading text-2xl font-semibold">
                {service.title}
              </h3>

              <p className="mt-3 font-sans leading-7 text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                The Difference
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Less manual work. More control over your business.
              </h2>

              <p className="mt-6 max-w-xl font-sans text-lg leading-8 text-muted">
                Good software should make the business easier to run. We focus
                on practical improvements that save time, reduce friction, and
                give you a clearer view of what is happening across your
                operations.
              </p>
            </div>

            <ul className="space-y-7">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-4 font-sans text-lg leading-7">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section id="work" className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              A Practical Example
            </p>

            <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              From scattered processes to one streamlined business system.
            </h2>

            <div className="mt-10 space-y-7 font-sans text-lg leading-8 text-white/70">
              <p>
                Imagine a local business managing enquiries through WhatsApp,
                customer details in Excel, appointments over phone calls, and
                invoices manually.
              </p>

              <p>
                We can bring that workflow together with a professional
                website, a custom CRM, automated WhatsApp or email follow-ups,
                appointment scheduling, and a centralized dashboard.
              </p>

              <p>
                Instead of switching between disconnected tools and manually
                moving information from one place to another, the business gets
                one streamlined system designed around how it operates.
              </p>
            </div>

            <p className="mt-12 max-w-2xl font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
              That is what custom business software should do: simplify the way
              your business works.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            How It Works
          </p>

          <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            A clear process from idea to working system.
          </h2>

          <p className="mt-6 font-sans text-lg leading-8 text-muted">
            Every project begins with understanding your business and defining
            clear requirements. We then create a roadmap, build in milestones
            with regular progress updates and demos, gather your feedback
            throughout development, deploy the solution securely, and provide
            ongoing support after launch.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <article key={step.number}>
              <span className="font-heading text-5xl font-bold text-accent">
                {step.number}
              </span>

              <h3 className="mt-5 font-heading text-2xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 font-sans leading-7 text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Why KreatenVibe */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Why KreatenVibe
              </p>

              <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Built around your business. Delivered with clarity.
              </h2>
            </div>

            <div>
              <div className="space-y-7 font-sans text-lg leading-8 text-muted">
                <p>
                  Every business is different. That is why we do not sell
                  one-size-fits-all software.
                </p>

                <p>
                  We work closely with you to understand your processes, build
                  software around your workflow, and support you from planning
                  to deployment. You get clear communication, transparent
                  delivery, and solutions designed for your business—not
                  generic templates.
                </p>
              </div>

              <ul className="mt-12 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {supportingPoints.map((point) => (
                  <li
                    key={point}
                    className="font-sans font-semibold text-foreground"
                  >
                    <span className="mr-3 text-accent">+</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Partner */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-4xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Long-Term Partnership
          </p>

          <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            Software that grows with your business.
          </h2>

          <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-muted sm:text-xl">
            The goal is not simply to launch software and move on. As your
            business changes, your systems may need to change with it.
            KreatenVibe is built around long-term support—helping you improve,
            automate, and extend your digital systems as your needs evolve.
          </p>
        </div>
      </section>

      {/* Social Proof / Work */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Selected Work
            </p>

            <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Built for real business problems.
            </h2>

            <p className="mt-6 font-sans text-lg leading-8 text-white/70">
              Explore how we turn complex workflows into practical digital
              systems.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            FAQ
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                {faq.question}
              </h3>

              <p className="mt-4 font-sans text-lg leading-8 text-muted">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="bg-accent text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Start a Conversation
            </p>

            <h2 className="mt-5 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              Ready to build a system that works the way your business does?
            </h2>

            <p className="mt-8 max-w-3xl font-sans text-lg leading-8 text-white/80 sm:text-xl">
              Tell us how your business works today, what is slowing you down,
              and what you want to improve. We will help you figure out what
              can be simplified, automated, or built around your workflow.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 font-sans text-sm font-semibold text-foreground"
              >
                Start Your Project
              </Link>

              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-sans text-sm font-semibold text-white"
              >
                Discuss Your Business Needs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}