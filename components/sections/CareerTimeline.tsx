"use client";

import { FrameCounter } from "@/components/frame/FrameCounter";

const TIMELINE_TRACKS = [
  {
    period: "2026 — PRESENT",
    role: "Graphic Designer",
    org: "ETV Network",
    type: "BROADCAST & DIGITAL MEDIA",
    scope:
      "Design visual content for broadcast and digital platforms, working within brand and editorial guidelines. Currently designing for ETV Andhra Pradesh, ETV Telangana, and ETV Network social media.",
  },
  {
    period: "JAN 2023 — JAN 2026",
    role: "Graphic Designer",
    org: "Mylaru Infra",
    type: "BRAND & REAL ESTATE PRINT",
    scope:
      "Designed posters, banners, pamphlets, and print materials for real estate projects and local outreach campaigns. Built the complete brand identity for Mylaru Infra and created full branding for its sister concern, Mylaru Group.",
  },
  {
    period: "FREELANCE",
    role: "Freelance Graphic Designer",
    org: "Independent",
    type: "BRANDING & PACKAGING",
    scope:
      "Branding and identity design, product packaging and visual design, Amazon listing design, product images, infographics, A+ content, and app/website mockups.",
  },
  {
    period: "2018 — 2019",
    role: "2D Assets Designer for Games",
    org: "APSSDC",
    type: "GAME PRODUCTION",
    scope:
      "Created 2D art assets for game projects while working collaboratively within game production teams.",
  },
  {
    period: "2018",
    role: "2D Artist",
    org: "IGDC Game Development Program",
    type: "GAME ART & PROTOTYPING",
    scope:
      "Created gaming assets and contributed to functional game prototypes while applying art and design principles.",
  },
];

export function CareerTimeline({ isStandalone = false }: { isStandalone?: boolean }) {
  return (
    <section className={`relative bg-[#0A0A0B] border-b border-line ${isStandalone ? "py-20 lg:py-28" : "py-16 lg:py-24"} overflow-hidden`}>
      <div className="relative z-[40] mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative z-[40] max-w-3xl space-y-4 mb-14 lg:mb-18">
          <FrameCounter index={4} total={7} label="PRODUCTION TIMELINE" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Career Tracks &amp; Milestones.
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted">
            A chronological progression across broadcast studios, visual effects facilities, and independent design practices.
          </p>
        </div>

        {/* Timeline Tracks */}
        <div className="relative z-[40] space-y-4">
          {TIMELINE_TRACKS.map((track, idx) => (
            <div
              key={`${track.role}-${track.org}`}
              className="group relative z-[40] rounded border border-line bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-white/40"
            >
              {/* Corner markers */}
              <span className="frame-corner-tl" aria-hidden="true" />
              <span className="frame-corner-tr" aria-hidden="true" />

              <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted">
                    <span className="signal-dot" />
                    <span className="text-foreground font-semibold">{track.period}</span>
                    <span className="text-line">•</span>
                    <span>{track.type}</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                    {track.role}
                  </h3>

                  <p className="font-mono text-xs text-muted/80 uppercase tracking-wider">
                    {track.org}
                  </p>
                </div>

                <div className="border-t border-line/40 pt-4 lg:border-t-0 lg:border-l lg:border-line/40 lg:pl-8 lg:pt-0">
                  <p className="font-sans text-sm sm:text-base leading-relaxed text-muted">
                    {track.scope}
                  </p>
                  <div className="mt-4 font-mono text-[9px] text-muted/40 uppercase tracking-widest">
                    TRACK_0{idx + 1} {"//"} VERIFIED
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
