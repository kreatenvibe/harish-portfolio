export function HeroProgress() {
  return (
    <aside
      className="hidden lg:flex pointer-events-none absolute right-4 xl:right-6 top-0 bottom-0 z-30 w-12 flex-col justify-between items-end py-10"
      aria-label="Hero progress indicator"
    >
      {/* Editorial top right label */}
      <div className="text-right font-mono text-[10px] uppercase leading-tight tracking-[0.2em] text-muted/80">
        <div className="flex items-center justify-end gap-2 mb-1">
          <span className="h-px w-3 bg-line" />
          <span>GRAPHIC</span>
        </div>
        <div>DESIGN</div>
        <div>PORTFOLIO</div>
      </div>

      {/* Vertical Track with Numbers and Active Indicator */}
      <div className="relative my-auto flex h-[55%] flex-col justify-between items-end pr-3">
        {/* Continuous hairline track line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-line" />

        {/* Active Red Track Indicator for Section 01 */}
        <div className="absolute right-0 top-0 h-[22%] w-[2px] bg-accent" />

        {/* Number Ticks */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-accent">01</span>
          <span className="h-px w-2 bg-accent" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted/60">02</span>
          <span className="h-px w-1 bg-line" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted/60">03</span>
          <span className="h-px w-1 bg-line" />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted/60">04</span>
          <span className="h-px w-1 bg-line" />
        </div>
      </div>

      {/* Bottom right scroll hint */}
      <div className="text-right font-mono text-[9px] uppercase leading-tight tracking-[0.2em] text-muted/70">
        <div className="flex items-center justify-end gap-2 mb-0.5">
          <span className="h-px w-3 bg-line" />
          <span>SCROLL</span>
        </div>
        <div>TO EXPLORE</div>
      </div>
    </aside>
  );
}
