import Link from "next/link";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";

export const metadata = {
  title: "Services — Visual Design & VFX Capabilities",
  description:
    "Capabilities in Brand Identity, Packaging Design, Social Media Motion, Print Production, and VFX Paint & Roto.",
};

const SERVICES = [
  {
    code: "SERVICE_01",
    title: "Brand Identity & Design Systems",
    scope: "Vector Systems, Typography, Mathematical Alignment, Comprehensive Guidelines",
    description:
      "Creating durable brand identities from initial concept to full implementation. We build cohesive visual languages, typography hierarchies, and scalable vector assets that maintain consistency across all formats.",
    deliverables: [
      "Primary & Secondary Logo Marks",
      "Comprehensive Brand Style Guides",
      "Typography & Color Architectures",
      "Digital & Vector Asset Toolkits",
    ],
  },
  {
    code: "SERVICE_02",
    title: "Product Packaging Design",
    scope: "Dielines, Surface Materials, Box Architecture, Retail Presence",
    description:
      "Engineering tactile packaging solutions that stand out on retail shelves and unboxing experiences. We combine spatial layout, substrate considerations, and print production specs for flawless manufacturing.",
    deliverables: [
      "Custom Dieline Layouts & Structures",
      "Label Systems & Product Containers",
      "Print-Ready CMYK & Spot Separation",
      "Photorealistic 3D / Matte Presentation",
    ],
  },
  {
    code: "SERVICE_03",
    title: "Social Media & Motion Campaigns",
    scope: "9:16 Vertical Content, Digital Canvases, Broadcast Pacing",
    description:
      "Designing high-cadence digital campaign assets and broadcast motion graphics that capture immediate attention. Tailored for multi-channel digital distribution with rhythmic typographic pacing.",
    deliverables: [
      "Vertical 9:16 Story & Reel Frameworks",
      "Dynamic Broadcast Title Packages",
      "Multi-Channel Campaign Toolkits",
      "Promotional Motion Sequences",
    ],
  },
  {
    code: "SERVICE_04",
    title: "Print & Editorial Production",
    scope: "Publication Layouts, Posters, Tactile Collateral, Registration Precision",
    description:
      "Physical and editorial print design executed with rigorous typographic care, grid systems, and print finishing knowledge from paper stock to binding.",
    deliverables: [
      "Editorial Books & Publications",
      "Large-Format Event Posters",
      "Stationery & Marketing Collateral",
      "Print Registration & Pre-Press Files",
    ],
  },
  {
    code: "SERVICE_05",
    title: "Paint & Roto VFX Prep",
    scope: "Wire Removal, Clean Plates, Tracking Cleanup, Sub-Pixel Rotoscopy",
    description:
      "Frame-by-frame visual effects preparation for film, broadcast television, and commercial footage. Delivering artifact-free clean plates and accurate roto mattes that integrate seamlessly into compositing pipelines.",
    deliverables: [
      "Wire Rig & Equipment Removals",
      "Tracking Marker & Blemish Cleanup",
      "Plate Reconstruction & Grain Matching",
      "Sub-Pixel Organic & Hard-Surface Roto",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-14 lg:px-8 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl space-y-6">
          <FrameCounter index="03" total={7} label="CAPABILITIES // SERVICE SUITE" />

          <div className="max-w-3xl space-y-4">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
              Studio Capabilities.
            </h1>
            <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
              Tailored visual design systems and frame-accurate visual effects plate preparation for studios, directors, and ambitious brands.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24 space-y-8">
        {SERVICES.map((service, idx) => (
          <div
            key={service.code}
            className="group relative rounded-lg border border-line bg-surface/50 p-8 sm:p-12 transition-all duration-300 hover:border-white/30 hover:bg-surface"
          >
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <span className="frame-corner-bl" aria-hidden="true" />
            <span className="frame-corner-br" aria-hidden="true" />
            <TrackingPoint className="top-6 right-6" variant="cross" label={`SPEC_0${idx + 1}`} />

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span>{service.code}</span>
                  <span className="text-line">•</span>
                  <span>{service.scope}</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-foreground transition-colors group-hover:text-white">
                  {service.title}
                </h2>

                <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>

              <div className="rounded border border-line/60 bg-background/80 p-6 space-y-4 font-mono text-xs">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">
                  KEY DELIVERABLES // SPEC
                </p>
                <ul className="space-y-2.5">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-foreground/90 font-sans text-sm">
                      <CheckCircle size={16} weight="fill" className="text-foreground/70 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Frame */}
      <section className="border-t border-line bg-surface/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border border-line rounded-lg bg-surface/70 p-8 sm:p-12">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                READY TO COMMISSION
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground">
                Discuss your project requirements.
              </h2>
              <p className="font-sans text-sm text-muted">
                From single shot plate cleanups to complete brand identities.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded border border-transparent bg-foreground px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all hover:bg-white shrink-0"
            >
              <span>START YOUR PROJECT</span>
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
