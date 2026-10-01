"use client";

import { FrameCounter } from "@/components/frame/FrameCounter";

const DESIGN_TOOLKIT = [
  {
    num: "01",
    name: "Brand Identity & Vector Systems",
    disciplines: "Adobe Illustrator / Photoshop / Vector Math",
    focus: "Logo systems, brand style guides, vector marks, and typography hierarchies across corporate and freelance projects.",
  },
  {
    num: "02",
    name: "Poster & Print Production",
    disciplines: "Adobe Photoshop / InDesign / Illustrator",
    focus: "Posters, banners, pamphlets, and print production materials for real estate and local outreach campaigns.",
  },
  {
    num: "03",
    name: "Packaging & E-Commerce Mockups",
    disciplines: "Adobe Illustrator / Photoshop / 3D Layout",
    focus: "Product packaging, visual layouts, Amazon listing graphics, infographics, A+ content, and mockups.",
  },
  {
    num: "04",
    name: "Broadcast Visuals & Digital Media",
    disciplines: "Adobe Photoshop / Illustrator / Premiere Pro",
    focus: "Visual content for broadcast platforms (ETV Andhra Pradesh & Telangana) and channel social media within brand guidelines.",
  },
  {
    num: "05",
    name: "Motion Graphics & Kinetic Typography",
    disciplines: "Adobe After Effects / Premiere Pro",
    focus: "Broadcast motion assets, campaign video edits, title sequences, and digital visual pacing.",
  },
  {
    num: "06",
    name: "3D & Digital Media Foundation",
    disciplines: "Autodesk Maya / Asset Pipelines",
    focus: "Supporting background in 3D assets, spatial layout, and game art adding technical depth to graphic design workflows.",
  },
];

export function TechnicalLayerStack() {
  return (
    <section className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="relative z-[40] mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="relative z-[40] max-w-3xl space-y-4 mb-14 lg:mb-18">
          <FrameCounter index="05" label="DESIGN TOOLKIT & SKILLS" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Software &amp; Design Toolkit.
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted">
            Graphic design capabilities structured with technical discipline—combining core vector tools with motion graphics and 3D digital media foundation.
          </p>
        </div>

        {/* Stack Layers */}
        <div className="relative z-[40] space-y-3">
          {DESIGN_TOOLKIT.map((item) => (
            <div
              key={item.num}
              className="group relative z-[40] flex flex-col md:flex-row md:items-center justify-between rounded border border-line bg-surface p-6 transition-all duration-300 hover:border-white/40 hover:bg-[#131317]"
            >
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                  TOOLKIT {item.num}
                </span>
                <span className="text-line hidden md:inline">/</span>
                <h3 className="font-heading text-xl md:text-2xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                  {item.name}
                </h3>
              </div>

              <div className="flex flex-col md:items-end gap-1 font-mono text-[10px] text-muted">
                <span className="text-foreground/85 font-medium">{item.disciplines}</span>
                <span className="text-muted/60 text-[9px]">{item.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
