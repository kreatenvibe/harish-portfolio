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
    title: "Brand Identity & Design",
    scope: "Logo Design, Brand Identity, Visual Identity Systems, Brand Style Guides, Brand Collateral",
    description:
      "Creating comprehensive brand identities and visual systems. Building memorable logo marks, cohesive brand style guides, color architectures, and full suites of marketing and corporate collateral.",
    deliverables: [
      "Logo Design & Brand Marks",
      "Brand Identity & Visual Systems",
      "Comprehensive Brand Style Guides",
      "Corporate & Marketing Collateral",
    ],
  },
  {
    code: "SERVICE_02",
    title: "Poster & Print Design",
    scope: "Posters, Banners, Pamphlets, Print Materials, Marketing Collateral",
    description:
      "Designing high-impact print collateral and outreach materials for campaigns, real estate projects, and corporate initiatives with meticulous typographic and layout discipline.",
    deliverables: [
      "Event, Promotional & Launch Posters",
      "Large-Format Banners & Signage",
      "Pamphlets, Flyers & Brochures",
      "Real Estate & Campaign Print Materials",
    ],
  },
  {
    code: "SERVICE_03",
    title: "Packaging & Product Design",
    scope: "Product Packaging, Packaging Visual Design, Product Presentation",
    description:
      "Designing tangible product packaging and visual presentations that command attention on retail shelves and digital showcases, balancing aesthetic clarity with product utility.",
    deliverables: [
      "Product Packaging Design",
      "Packaging Visual Layouts & Labels",
      "Product Presentation Graphics",
      "Print-Ready Packaging Assets",
    ],
  },
  {
    code: "SERVICE_04",
    title: "Digital & Social Media Design",
    scope: "Digital Visual Content, Social Media Graphics, Digital Campaign Visuals, Broadcast/Digital Design Assets",
    description:
      "Designing visual content and campaign graphics for broadcast networks and digital platforms, operating within editorial standards and brand guidelines.",
    deliverables: [
      "Broadcast Visual Design Assets",
      "Channel Social Media Graphics",
      "Digital Campaign Visuals",
      "Platform-Specific Visual Assets",
    ],
  },
  {
    code: "SERVICE_05",
    title: "E-Commerce & Mockups",
    scope: "Amazon Listing Design, Product Images, Infographics, A+ Content, App Mockups, Website Mockups",
    description:
      "Creating high-conversion e-commerce visuals, feature-driven product infographics, comprehensive Amazon A+ content, and realistic UI mockups for digital products and platforms.",
    deliverables: [
      "Amazon Listing Visual Sets & Main Images",
      "Product Feature Infographics",
      "Enhanced Brand / A+ Content Layouts",
      "App & Website Mockups",
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
              Tailored graphic design systems, print collateral, product packaging, and broadcast visual assets for corporate and independent platforms.
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
