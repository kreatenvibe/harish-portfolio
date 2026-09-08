"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions/lead.action";
import { ArrowUpRight } from "@phosphor-icons/react";

const FIELD_CLASS =
  "mt-2 w-full rounded border border-line bg-background/80 px-4 py-3 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-white/40 focus:bg-surface";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

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
      <div id="project-form" className="relative rounded-lg border border-line bg-surface/80 p-10 text-center space-y-4">
        <span className="frame-corner-tl" aria-hidden="true" />
        <span className="frame-corner-tr" aria-hidden="true" />
        <span className="signal-dot mx-auto" />
        <p className="font-heading text-3xl font-bold uppercase text-foreground">
          TRANSMISSION RECEIVED // INITIATED
        </p>
        <p className="font-sans text-sm text-muted max-w-md mx-auto">
          Thank you for reaching out. I have received your project details and will follow up shortly with approach and scope recommendations.
        </p>
      </div>
    );
  }

  return (
    <div id="project-form" className="relative rounded-lg border border-line bg-surface/60 p-6 sm:p-10">
      <span className="frame-corner-tl" aria-hidden="true" />
      <span className="frame-corner-tr" aria-hidden="true" />
      <span className="frame-corner-bl" aria-hidden="true" />
      <span className="frame-corner-br" aria-hidden="true" />

      <div className="flex items-center justify-between border-b border-line/40 pb-4 mb-8 font-mono text-[10px] tracking-widest text-muted uppercase">
        <span className="text-foreground/80 font-semibold">PROJECT INTAKE FORM</span>
        <span>DELIVERY SPEC</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* Name & Studio Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={FIELD_CLASS}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="business" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Studio / Company
            </label>
            <input
              id="business"
              name="business"
              type="text"
              className={FIELD_CLASS}
              placeholder="Studio or brand name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={FIELD_CLASS}
            placeholder="you@studio.com"
          />
        </div>

        {/* Project Scope */}
        <div>
          <label
            htmlFor="business-description"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Discipline &amp; Project Type
          </label>
          <textarea
            id="business-description"
            name="business-description"
            rows={2}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Brand Identity, Packaging, Paint Prep / Roto, Motion, or Print Design"
          />
        </div>

        {/* Deliverables & Timeline */}
        <div>
          <label htmlFor="what-to-build" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Deliverables &amp; Deadline
          </label>
          <textarea
            id="what-to-build"
            name="what-to-build"
            rows={3}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Key deliverables, number of shot plates, and expected delivery timeline"
          />
        </div>

        {/* Additional details */}
        <div>
          <label htmlFor="anything-else" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Additional Context or Plate References
          </label>
          <textarea
            id="anything-else"
            name="anything-else"
            rows={2}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Links to footage references, moodboards, or existing brand guidelines"
          />
        </div>

        {errorMessage && (
          <p className="font-mono text-xs text-red-400 font-semibold">{errorMessage}</p>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all hover:bg-white disabled:opacity-50 cursor-pointer"
          >
            <span>{status === "submitting" ? "TRANSMITTING..." : "SUBMIT PROJECT BRIEF"}</span>
            <ArrowUpRight size={14} weight="bold" />
          </button>
        </div>
      </form>
    </div>
  );
}
