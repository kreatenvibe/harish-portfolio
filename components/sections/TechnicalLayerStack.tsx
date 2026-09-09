"use client";

import { FrameCounter } from "@/components/frame/FrameCounter";

const COMPOSITING_LAYERS = [
  {
    layer: "LAYER 01",
    name: "Brand Identity & Visual Design",
    disciplines: "Adobe Photoshop / Adobe Illustrator",
    focus: "Logo systems, brand style guides, vector marks, and typography hierarchies across corporate and freelance projects.",
  },
  {
    layer: "LAYER 02",
    name: "Poster & Print Collateral",
    disciplines: "Adobe Photoshop / Adobe Illustrator",
    focus: "Posters, banners, pamphlets, and print production materials for real estate and local outreach campaigns.",
  },
  {
    layer: "LAYER 03",
    name: "Packaging & E-Commerce Visuals",
    disciplines: "Adobe Photoshop / Adobe Illustrator",
    focus: "Product packaging, visual layouts, Amazon listing graphics, infographics, A+ content, and mockups.",
  },
  {
    layer: "LAYER 04",
    name: "Broadcast Visual Content",
    disciplines: "Adobe Photoshop / Adobe Illustrator / Adobe Premiere Pro",
    focus: "Visual content for broadcast platforms (ETV Andhra Pradesh & Telangana) and channel social media within brand guidelines.",
  },
  {
    layer: "LAYER 05",
    name: "Motion Graphics & Video",
    disciplines: "Adobe After Effects / Adobe Premiere Pro",
    focus: "Broadcast motion assets, campaign video edits, and digital visual pacing.",
  },
  {
    layer: "LAYER 06",
    name: "3D & VFX Pipeline Background",
    disciplines: "Autodesk Maya / Silhouette",
    focus: "Supporting background in 3D assets, game art, and animation/VFX adding technical and production pipeline understanding.",
  },
];

export function TechnicalLayerStack() {
  return (
    <section className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="relative z-[40] mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="relative z-[40] max-w-3xl space-y-4 mb-14 lg:mb-18">
          <FrameCounter index={5} total={7} label="TECHNICAL STACK" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Design &amp; Software Stack.
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted">
            Graphic design capabilities structured with technical discipline—combining core visual design tools with motion, video, and 3D/VFX pipeline background.
          </p>
        </div>

        {/* Stack Layers */}
        <div className="relative z-[40] space-y-3">
          {COMPOSITING_LAYERS.map((item) => (
            <div
              key={item.layer}
              className="group relative z-[40] flex flex-col md:flex-row md:items-center justify-between rounded border border-line bg-surface p-6 transition-all duration-300 hover:border-white/40"
            >
              {/* Corner marks */}
              <span className="frame-corner-tl" aria-hidden="true" />
              <span className="frame-corner-tr" aria-hidden="true" />

              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                  {item.layer}
                </span>
                <span className="text-line hidden md:inline">/</span>
                <h3 className="font-heading text-xl md:text-2xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                  {item.name}
                </h3>
              </div>

              <div className="flex flex-col md:items-end gap-1 font-mono text-[10px] text-muted">
                <span className="text-foreground/80 font-medium">{item.disciplines}</span>
                <span className="text-muted/60 text-[9px]">{item.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
