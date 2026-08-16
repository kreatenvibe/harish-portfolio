"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions/lead.action";

const FIELD_CLASS =
  "mt-3 w-full rounded-xl bg-[#f4f4f2] px-4 py-3.5 font-sans text-base text-foreground outline-none placeholder:text-muted/60 focus:bg-[#eeeeec]";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Capture the form element before the await — React nulls out
    // e.currentTarget once the event has finished dispatching.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitLead({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      business: String(formData.get("business") ?? "") || undefined,
      businessDescription:
        String(formData.get("business-description") ?? "") || undefined,
      improvement: String(formData.get("improvement") ?? "") || undefined,
      currentTools: String(formData.get("current-tools") ?? "") || undefined,
      whatToBuild: String(formData.get("what-to-build") ?? "") || undefined,
      anythingElse: String(formData.get("anything-else") ?? "") || undefined,
      website: String(formData.get("website") ?? ""),
    });

    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    form.reset();
  };

  if (status === "success") {
    return (
      <div id="project-form" className="rounded-2xl bg-[#f4f4f2] p-10 text-center">
        <p className="font-heading text-2xl font-bold text-foreground">
          Thanks — we&apos;ve got it.
        </p>
        <p className="mt-3 font-sans text-base text-muted">
          We&apos;ll get back to you shortly to discuss your project.
        </p>
      </div>
    );
  }

  return (
    <div id="project-form">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Honeypot — hidden from real users, bots tend to fill every field */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* Name */}
        <div>
          <label htmlFor="name" className="font-sans text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={FIELD_CLASS}
            placeholder="Your name"
          />
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="business" className="font-sans text-sm font-semibold">
            Business name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            className={FIELD_CLASS}
            placeholder="Your business name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="font-sans text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={FIELD_CLASS}
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
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Tell us a little about your business"
          />
        </div>

        {/* Improve */}
        <div>
          <label htmlFor="improvement" className="font-sans text-sm font-semibold">
            What are you trying to improve?
          </label>
          <textarea
            id="improvement"
            name="improvement"
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="What is taking too much time or creating friction?"
          />
        </div>

        {/* Current Tools */}
        <div>
          <label htmlFor="current-tools" className="font-sans text-sm font-semibold">
            What tools or processes are you currently using?
          </label>
          <textarea
            id="current-tools"
            name="current-tools"
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="For example: Excel, WhatsApp, email, existing CRM, manual processes..."
          />
        </div>

        {/* Build */}
        <div>
          <label htmlFor="what-to-build" className="font-sans text-sm font-semibold">
            What would you like to build or automate?
          </label>
          <textarea
            id="what-to-build"
            name="what-to-build"
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Tell us what you have in mind, even if you are not sure yet."
          />
        </div>

        {/* Anything Else */}
        <div>
          <label htmlFor="anything-else" className="font-sans text-sm font-semibold">
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

        {errorMessage && (
          <p className="font-sans text-sm text-accent">{errorMessage}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex rounded-full bg-accent px-7 py-3.5 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Start Your Project"}
        </button>
      </form>
    </div>
  );
}
