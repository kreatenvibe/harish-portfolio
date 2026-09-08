"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";

const CAPABILITIES = [
  { code: "01", title: "Rotoscopy & Masking", desc: "Organic & hard-surface matte extraction with edge fidelity" },
  { code: "02", title: "Clean Plates & Paint Prep", desc: "Wire removal, marker cleanup, and plate reconstruction" },
  { code: "03", title: "Brand Identity Systems", desc: "Vector identities, typography systems, and brand guidelines" },
  { code: "04", title: "Packaging & Print Production", desc: "Dielines, surface finishes, and editorial publication design" },
];

export function IdentityDossier() {
  return (
    <section id="about" className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Dossier Frame */}
        <div className="relative rounded border border-line bg-surface p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* 4 Corner Markers */}
          <span className="frame-corner-tl" aria-hidden="true" />
          <span className="frame-corner-tr" aria-hidden="true" />
          <span className="frame-corner-bl" aria-hidden="true" />
          <span className="frame-corner-br" aria-hidden="true" />

          {/* Tracking Marker */}
          <TrackingPoint className="top-6 right-6" variant="bracket" />

          {/* Frame Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-5 font-mono text-[9px] tracking-widest text-muted uppercase mb-10">
            <FrameCounter index={3} total={7} label="IDENTITY DOSSIER" />
            <div className="flex items-center gap-2">
              <span className="signal-dot" />
              <span className="text-foreground/80 font-semibold">HARISH KUMAR G</span>
            </div>
          </div>

          {/* Dossier Grid Layout */}
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-start">
            {/* Left Column: Bio Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded border border-line bg-[#161619] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                <span className="text-foreground">ETV NETWORK</span>
                <span className="text-line">•</span>
                <span>GRAPHIC DESIGNER &amp; PAINT &amp; ROTO ARTIST</span>
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
                Crafting visual systems with plate-accurate precision.
              </h2>

              <div className="space-y-4 font-sans text-base sm:text-lg leading-relaxed text-muted">
                <p>
                  Detail-driven Graphic Designer and Paint &amp; Roto artist
                  with extensive experience across broadcast media, commercial branding
                  systems, and visual effects production.
                </p>
                <p>
                  Currently working as a Graphic Designer at ETV Network,
                  delivering tailored visual solutions, broadcast graphics, and
                  frame-accurate VFX plate cleanups for studios and brands.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded border border-line bg-[#161619] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  <span>FULL DOSSIER &amp; TIMELINE</span>
                  <ArrowUpRight size={13} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Right Column: Capabilities Matrix */}
            <div className="space-y-4">
              <div className="border-b border-line/40 pb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                CORE DISCIPLINES
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {CAPABILITIES.map((cap) => (
                  <div
                    key={cap.code}
                    className="rounded border border-line/60 bg-[#141417] p-5 space-y-2 transition-colors hover:border-white/30"
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-muted">
                      <span className="text-foreground font-semibold">0{cap.code}</span>
                      <span>DISCIPLINE</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold uppercase text-foreground">
                      {cap.title}
                    </h3>
                    <p className="font-sans text-xs text-muted leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
