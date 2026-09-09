import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { CareerTimeline } from "@/components/sections/CareerTimeline";
import { TechnicalLayerStack } from "@/components/sections/TechnicalLayerStack";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";

export const metadata = {
  title: "About — Harish Kumar G",
  description:
    "Graphic Designer and Paint & Roto artist with experience in broadcast media, brand systems, and VFX production.",
};

const approachPoints = [
  {
    number: "01",
    title: "Look Closely First.",
    description:
      "Whether it is a plate that needs a wire rig removed or a brand that needs an identity system, the work begins by understanding the foundational requirements and what flawless delivery looks like for that medium.",
  },
  {
    number: "02",
    title: "Work With Purpose.",
    description:
      "Every pass on a plate and every typographic decision must earn its place. The goal is a clean result that holds up under close scrutiny, not just something that looks finished at a distance.",
  },
  {
    number: "03",
    title: "Stay Collaborative.",
    description:
      "Great broadcast, VFX, and design work relies on clear communication. I share work-in-progress early, absorb feedback from senior leads and clients, and refine iteratively.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Editorial Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl space-y-6">
            <FrameCounter index="01" total={3} label="IDENTITY DOSSIER" />

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
              Harish Kumar G
            </h1>

            <p className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted">
              GRAPHIC DESIGNER // ETV NETWORK
            </p>

            <p className="font-sans text-lg sm:text-xl leading-relaxed text-muted max-w-3xl">
              Graphic Designer with experience creating branding assets, posters, and visual materials across corporate and freelance settings, currently designing for broadcast and digital platforms at ETV Network.
            </p>
          </div>
        </div>
      </section>

      {/* Story & Background Frame */}
      <section className="border-b border-line bg-surface/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-lg border border-line bg-surface/70 p-8 sm:p-12 lg:p-16 overflow-hidden">
            <span className="frame-corner-tl" aria-hidden="true" />
            <span className="frame-corner-tr" aria-hidden="true" />
            <span className="frame-corner-bl" aria-hidden="true" />
            <span className="frame-corner-br" aria-hidden="true" />
            <TrackingPoint className="top-6 right-6" variant="bracket" label="BIO_01" />

            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  BACKGROUND &amp; PRACTICE
                </p>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground">
                  Disciplined craft across print, digital, and broadcast media.
                </h2>
              </div>

              <div className="space-y-6 font-sans text-base sm:text-lg leading-relaxed text-muted">
                <p>
                  I am a Graphic Designer currently creating visual content for broadcast and digital platforms at ETV Network, designing within brand and editorial guidelines across broadcast channels and social media.
                </p>
                <p>
                  With experience spanning corporate in-house roles and independent freelance practice, I have created complete brand identity systems, real estate marketing collateral, product packaging, and digital assets.
                </p>
                <p>
                  My background in game art and animation/VFX adds a strong technical and production-pipeline understanding to my design work, allowing me to collaborate effectively across print, digital, and motion-based visual media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Career Tracks */}
      <CareerTimeline isStandalone />

      {/* Technical Compositing Layer Stack */}
      <TechnicalLayerStack />

      {/* Working Principles */}
      <section className="border-b border-line bg-surface/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-14 lg:mb-18">
            <FrameCounter index="03" total={3} label="METHODOLOGY" />
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground">
              Production Philosophy.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {approachPoints.map((point) => (
              <div
                key={point.number}
                className="relative rounded-lg border border-line/70 bg-surface/60 p-8 space-y-4"
              >
                <span className="frame-corner-tl" aria-hidden="true" />
                <span className="frame-corner-tr" aria-hidden="true" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
                  STEP_{point.number}
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-foreground">
                  {point.title}
                </h3>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-muted">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 border border-line rounded-lg bg-surface/60 p-8 sm:p-12">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                NEXT SEQUENCE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase text-foreground">
                Ready to initiate a project?
              </h2>
              <p className="font-sans text-sm text-muted">
                Let us discuss your project deliverables, shot plates, or branding requirements.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded border border-foreground bg-foreground px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-all hover:bg-white shrink-0"
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
