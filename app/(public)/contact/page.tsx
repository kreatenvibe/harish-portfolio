import { EnvelopeSimple, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
import ContactForm from "@/components/sections/ContactForm";
import { FrameCounter } from "@/components/frame/FrameCounter";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import { CONTACT } from "@/lib/contact";

export const metadata = {
  title: "Contact — Initiate Project",
  description:
    "Get in touch with Harish Kumar G for brand identity, packaging, print design, or VFX paint & roto commissions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="relative border-b border-line px-6 pt-24 pb-16 lg:px-8 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
            {/* Intro & Direct Channels */}
            <div className="space-y-8">
              <div className="space-y-4">
                <FrameCounter index="07" total={7} label="CONTACT // INITIATE" />

                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.92]">
                  Initiate a Project.
                </h1>

                <p className="font-sans text-base sm:text-lg leading-relaxed text-muted">
                  Share your project scope, shot plates, or branding deliverables.
                  I will review the requirements and follow up with estimated delivery timelines and strategic approach.
                </p>
              </div>

              {/* Direct Info Box */}
              <div className="relative rounded-lg border border-line bg-surface/60 p-6 space-y-5 font-mono text-xs">
                <span className="frame-corner-tl" aria-hidden="true" />
                <span className="frame-corner-tr" aria-hidden="true" />
                <TrackingPoint className="top-4 right-4" variant="cross" />

                <div className="border-b border-line/40 pb-3 text-foreground font-semibold tracking-widest uppercase text-[10px]">
                  DIRECT CHANNELS
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-muted/60 text-[10px] uppercase">EMAIL</span>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="flex items-center gap-2 text-foreground font-semibold hover:underline"
                    >
                      <EnvelopeSimple size={15} weight="bold" />
                      <span>{CONTACT.email}</span>
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted/60 text-[10px] uppercase">PHONE / WHATSAPP</span>
                    <a
                      href={CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground font-semibold hover:underline"
                    >
                      <Phone size={15} weight="bold" />
                      <span>{CONTACT.phoneDisplay} (WhatsApp)</span>
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted/60 text-[10px] uppercase">BASE LOCATION</span>
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin size={15} weight="bold" />
                      <span className="font-sans text-xs">Hyderabad, India • ETV Network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}