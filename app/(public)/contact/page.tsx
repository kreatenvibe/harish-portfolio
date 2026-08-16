import Link from "next/link";

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
                Prefer to discuss it first?
              </p>

              <Link
                href="#project-form"
                className="mt-3 inline-flex font-sans text-sm font-semibold text-accent"
              >
                Discuss Your Business Needs →
              </Link>
            </div>
          </div>

          {/* Form */}
          <div id="project-form">
            <form className="space-y-8">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="font-sans text-sm font-semibold"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-3 w-full rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="Your name"
                />
              </div>

              {/* Business Name */}
              <div>
                <label
                  htmlFor="business"
                  className="font-sans text-sm font-semibold"
                >
                  Business name
                </label>

                <input
                  id="business"
                  name="business"
                  type="text"
                  className="mt-3 w-full rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="Your business name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="font-sans text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-3 w-full rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="you@company.com"
                />
              </div>

              {/* Business */}
              <div>
                <label
                  htmlFor="business-description"
                  className="font-sans text-sm font-semibold"
                >
                  What does your business do?
                </label>

                <textarea
                  id="business-description"
                  name="business-description"
                  rows={3}
                  className="mt-3 w-full resize-none rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="Tell us a little about your business"
                />
              </div>

              {/* Improve */}
              <div>
                <label
                  htmlFor="improvement"
                  className="font-sans text-sm font-semibold"
                >
                  What are you trying to improve?
                </label>

                <textarea
                  id="improvement"
                  name="improvement"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="What is taking too much time or creating friction?"
                />
              </div>

              {/* Current Tools */}
              <div>
                <label
                  htmlFor="current-tools"
                  className="font-sans text-sm font-semibold"
                >
                  What tools or processes are you currently using?
                </label>

                <textarea
                  id="current-tools"
                  name="current-tools"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="For example: Excel, WhatsApp, email, existing CRM, manual processes..."
                />
              </div>

              {/* Build */}
              <div>
                <label
                  htmlFor="what-to-build"
                  className="font-sans text-sm font-semibold"
                >
                  What would you like to build or automate?
                </label>

                <textarea
                  id="what-to-build"
                  name="what-to-build"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]"
                  placeholder="Tell us what you have in mind, even if you are not sure yet."
                />
              </div>

              {/* Anything Else */}
              <div>
                <label
                  htmlFor="anything-else"
                  className="font-sans text-sm font-semibold"
                >
                  Anything else we should know?
                </label>

                <textarea
                  id="anything-else"
                  name="anything-else"
                  rows={4}
                  className="mt-3 w-full resize-none bg-transparent px-0 py-3 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:border-accent"
                  placeholder="Anything else that might help us understand your project"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white"
              >
                Start Your Project
              </button>
            </form>
          </div>
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