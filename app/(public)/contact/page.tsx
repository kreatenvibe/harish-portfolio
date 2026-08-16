import Link from "next/link";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import ContactForm from "@/components/sections/ContactForm";
import { CONTACT } from "@/lib/contact";

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* Intro */}
          <div>
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Start Your Project
            </p>

            <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Tell us what you want to simplify.
            </h1>

            <p className="mt-8 max-w-xl font-sans text-lg leading-8 text-muted sm:text-xl">
              You do not need to have the technical solution figured out. Tell
              us how your business works today, what is taking too much time,
              what tools you are using, and what you want to improve. We will
              help you work out the right approach.
            </p>

            <div className="mt-10">
              <p className="font-sans text-sm font-semibold text-foreground">
                Prefer to reach out directly?
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent"
                >
                  <EnvelopeSimple weight="bold" className="shrink-0" />
                  {CONTACT.email}
                </a>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent"
                >
                  <Phone weight="bold" className="shrink-0" />
                  {CONTACT.phoneDisplay} (WhatsApp)
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#f4f4f2]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Have a business problem to solve?
            </h2>

            <Link
              href="#project-form"
              className="inline-flex w-fit rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white"
            >
              Discuss Your Business Needs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}