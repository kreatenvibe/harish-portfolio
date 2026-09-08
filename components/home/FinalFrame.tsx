"use client";

import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, Phone } from "@phosphor-icons/react";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { CONTACT } from "@/lib/contact";

export function FinalFrame() {
  return (
    <section id="contact" className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Final Frame */}
        <div className="relative rounded border border-line bg-surface p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
          {/* Corner Ticks */}
          <span className="frame-corner-tl" aria-hidden="true" />
          <span className="frame-corner-tr" aria-hidden="true" />
          <span className="frame-corner-bl" aria-hidden="true" />
          <span className="frame-corner-br" aria-hidden="true" />

          {/* Tracking Marker */}
          <TrackingPoint className="top-8 right-8" variant="target" />

          {/* Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-5 font-mono text-[9px] tracking-widest text-muted uppercase mb-10">
            <FrameCounter index={6} total={7} label="FINAL FRAME // INITIATE" />
            <div className="flex items-center gap-2">
              <span className="signal-dot" />
              <span className="text-foreground/80 font-semibold">DELIVERY PIPELINE OPEN</span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
                Have a brand to shape or footage to clean?
              </h2>

              <p className="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-muted">
                Tell me about your deliverables, timeline, or shot plates.
                Whether it is comprehensive brand systems or frame-accurate paint &amp; roto cleanup, let us determine the exact scope.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  <span>START YOUR PROJECT</span>
                  <ArrowUpRight size={13} weight="bold" />
                </Link>

                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-line bg-[#161619] px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  <span>WHATSAPP DIRECT</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
              </div>
            </div>

            {/* Right Contact Card */}
            <div className="rounded border border-line/60 bg-[#121215] p-8 space-y-6 font-mono text-xs">
              <div className="border-b border-line/40 pb-3 font-mono text-[9px] uppercase tracking-widest text-foreground font-semibold">
                DIRECT CHANNELS
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-muted/60 uppercase text-[9px]">EMAIL INQUIRY</span>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center gap-2 text-foreground font-semibold hover:underline"
                  >
                    <EnvelopeSimple size={14} weight="bold" />
                    <span>{CONTACT.email}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-muted/60 uppercase text-[9px]">PHONE / WHATSAPP</span>
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground font-semibold hover:underline"
                  >
                    <Phone size={14} weight="bold" />
                    <span>{CONTACT.phoneDisplay}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-muted/60 uppercase text-[9px]">LOCATION // STATION</span>
                  <p className="text-muted font-sans text-xs">Hyderabad, India • ETV Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
