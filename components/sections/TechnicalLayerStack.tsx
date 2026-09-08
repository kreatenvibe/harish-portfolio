"use client";

import { FrameCounter } from "@/components/frame/FrameCounter";

const COMPOSITING_LAYERS = [
  {
    layer: "LAYER 01",
    name: "Visual Design & Art Direction",
    disciplines: "Graphic Design / Editorial Systems / Layout",
    focus: "Composition, typographic contrast, and deliberate hierarchy across surfaces.",
  },
  {
    layer: "LAYER 02",
    name: "Brand Systems & Identity",
    disciplines: "Logo Systems / Style Guides / Guidelines",
    focus: "Vector geometry, brand architectures, and cross-platform identity consistency.",
  },
  {
    layer: "LAYER 03",
    name: "Paint Prep & Clean Plates",
    disciplines: "Wire Removal / Tracking Marker Cleanup / Plate Reconstruction",
    focus: "Frame-accurate grain matching, artifact removal, and background recreation.",
  },
  {
    layer: "LAYER 04",
    name: "Rotoscopy & Matte Generation",
    disciplines: "Silhouette / Organic Shapes / Hard Surface Extraction",
    focus: "Sub-pixel edge fidelity, motion blur preservation, and complex matte isolation.",
  },
  {
    layer: "LAYER 05",
    name: "Packaging & Physical Production",
    disciplines: "Dieline Architecture / Finishes / Print Specs",
    focus: "Precision dielines, CMYK/spot color separation, and material tactile depth.",
  },
  {
    layer: "LAYER 06",
    name: "Broadcast & Motion Collateral",
    disciplines: "Broadcast Graphics / 9:16 Campaign Motion",
    focus: "Pacing, timing curves, and high-cadence digital video delivery.",
  },
];

export function TechnicalLayerStack() {
  return (
    <section className="relative bg-[#0A0A0B] border-b border-line py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-14 lg:mb-18">
          <FrameCounter index={5} total={7} label="TECHNICAL STACK" />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
            Compositing Layer Stack.
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted">
            Capabilities structured as a multi-pass compositing stack—each layer adding systematic refinement from raw concept to finished plate.
          </p>
        </div>

        {/* Stack Layers */}
        <div className="space-y-3">
          {COMPOSITING_LAYERS.map((item) => (
            <div
              key={item.layer}
              className="group relative flex flex-col md:flex-row md:items-center justify-between rounded border border-line bg-surface p-6 transition-all duration-300 hover:border-white/40"
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
