import Link from "next/link";
import { HeroProjectCard } from "./HeroProjectCard";
import { HeroProgress } from "./HeroProgress";
import { HeroMotionPath } from "./HeroMotionPath";

export function Hero() {
  return (
    <section className="relative w-full bg-[#F2F3F5] text-foreground overflow-hidden select-none border-b border-line">
      {/* Container sizing for viewport composition */}
      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] lg:h-[900px] xl:h-[960px] 2xl:h-[1020px] max-w-[1800px] flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 pt-5 pb-8">
        {/* Top Mini-Nav Bar matching reference */}
        <header className="relative z-30 flex items-center justify-between">
          <nav
            aria-label="Hero navigation"
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80"
          >
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              HOME
            </span>
            <span className="text-line" aria-hidden="true">|</span>
            <Link
              href="/work"
              className="transition-colors hover:text-accent"
            >
              WORK
            </Link>
            <span className="text-line" aria-hidden="true">|</span>
            <Link
              href="/about"
              className="transition-colors hover:text-accent"
            >
              ABOUT
            </Link>
            <span className="text-line" aria-hidden="true">|</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-accent"
            >
              CONTACT
            </Link>
          </nav>
        </header>

        {/* ========================================================================= */}
        {/* DESKTOP 16:9 STAGE COMPOSITION (lg and above) */}
        {/* ========================================================================= */}
        <div className="relative hidden lg:block flex-1 w-full my-auto">
          {/* Static Red Motion Path (Layer behind Social Media) */}
          <HeroMotionPath />

          {/* Left Large Display Title: "SELECTED WORK" */}
          <div className="absolute left-0 xl:left-2 top-[6%] z-20 pointer-events-none">
            <h1 className="font-heading font-black text-[7.5rem] xl:text-[9.5rem] 2xl:text-[11rem] leading-[0.82] tracking-tighter text-foreground drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]">
              SELECTED
              <br />
              WORK
            </h1>
          </div>

          {/* Left Metadata 1: IDEAS / VISUALS / IMPACT */}
          <div className="absolute left-0 xl:left-2 top-[54%] z-20 pointer-events-none">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-muted">
              <div>IDEAS</div>
              <div>VISUALS</div>
              <div>IMPACT</div>
              <span className="block mt-2 h-px w-5 bg-line" />
            </div>
          </div>

          {/* Left Metadata 2: DESIGN / MOVES / PEOPLE */}
          <div className="absolute left-0 xl:left-2 bottom-4 z-20 pointer-events-none">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-muted">
              <span className="block mb-2 h-px w-5 bg-line" />
              <div>DESIGN</div>
              <div>MOVES</div>
              <div>PEOPLE</div>
            </div>
          </div>

          {/* 1. BRANDING (Upper Left/Center, tilted -4.5deg) */}
          <div className="absolute left-[20%] xl:left-[21%] top-[8%] z-10 w-[38%] xl:w-[37%] 2xl:w-[36%] -rotate-[4.5deg]">
            <HeroProjectCard
              number="01"
              title="BRANDING"
              imageSrc="/images/hero/branding.png"
              imageAlt="Branding and visual identity project showcase"
              variant="branding"
            />
          </div>

          {/* 2. PACKAGING (Upper Right, tilted -3.5deg) */}
          <div className="absolute right-[6%] xl:right-[7%] top-[10%] z-10 w-[33%] xl:w-[31%] 2xl:w-[30%] -rotate-[3.5deg]">
            <HeroProjectCard
              number="02"
              title="PACKAGING"
              imageSrc="/images/hero/packaging.png"
              imageAlt="Packaging and label design project showcase"
              variant="packaging"
            />
          </div>

          {/* 3. SOCIAL MEDIA (Lower Left, tilted +5.5deg) */}
          <div className="absolute left-[11%] xl:left-[11%] bottom-[6%] z-20 w-[26%] xl:w-[24%] 2xl:w-[23%] rotate-[5.5deg]">
            <HeroProjectCard
              number="03"
              title="SOCIAL MEDIA"
              imageSrc="/images/hero/social-media.png"
              imageAlt="Social media campaign and creative assets showcase"
              variant="social"
            />
          </div>

          {/* 4. PRINT DESIGN (Lower Right, tilted -3.5deg) */}
          <div className="absolute right-[11%] xl:right-[12%] bottom-[3%] z-10 w-[39%] xl:w-[38%] 2xl:w-[37%] -rotate-[3.5deg]">
            <HeroProjectCard
              number="04"
              title="PRINT DESIGN"
              imageSrc="/images/hero/print-design.png"
              imageAlt="Print design and editorial layout project showcase"
              variant="print"
            />
          </div>

          {/* Right Progress & Metadata Track */}
          <HeroProgress />
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET RESPONSIVE ARRANGEMENT (< lg) */}
        {/* ========================================================================= */}
        <div className="lg:hidden mt-8 flex flex-col gap-10">
          {/* Main Title */}
          <div>
            <h1 className="font-heading font-black text-6xl sm:text-7xl md:text-8xl leading-[0.85] tracking-tighter text-foreground">
              SELECTED
              <br />
              WORK
            </h1>
            <div className="mt-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              <span>IDEAS · VISUALS · IMPACT</span>
              <span className="h-px w-6 bg-line" />
            </div>
          </div>

          {/* Cards Staggered Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4">
            <div className="sm:-rotate-2">
              <HeroProjectCard
                number="01"
                title="BRANDING"
                imageSrc="/images/hero/branding.png"
                imageAlt="Branding and visual identity project showcase"
                variant="branding"
              />
            </div>

            <div className="sm:rotate-2 sm:mt-6">
              <HeroProjectCard
                number="02"
                title="PACKAGING"
                imageSrc="/images/hero/packaging.png"
                imageAlt="Packaging and label design project showcase"
                variant="packaging"
              />
            </div>

            <div className="sm:rotate-3">
              <HeroProjectCard
                number="03"
                title="SOCIAL MEDIA"
                imageSrc="/images/hero/social-media.png"
                imageAlt="Social media campaign and creative assets showcase"
                variant="social"
              />
            </div>

            <div className="sm:-rotate-2 sm:mt-6">
              <HeroProjectCard
                number="04"
                title="PRINT DESIGN"
                imageSrc="/images/hero/print-design.png"
                imageAlt="Print design and editorial layout project showcase"
                variant="print"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
