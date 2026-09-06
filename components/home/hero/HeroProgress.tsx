export function HeroProgress() {
  return (
    <aside
      className="hidden lg:flex pointer-events-none absolute right-4 xl:right-6 top-0 bottom-0 z-40 w-10 flex-col justify-center items-end"
      aria-label="Hero progress indicator"
    >
      {/* Minimal Vertical Track with Active Progress Indicator */}
      <div className="relative flex h-[45%] max-h-[280px] min-h-[180px] flex-col justify-between items-end pr-3">
        {/* Continuous hairline track line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-line" />

        {/* Active Red Track Indicator */}
        <div
          data-hero-progress-bar
          className="absolute right-0 top-0 h-[25%] w-[2px] bg-accent will-change-transform"
        />

        {/* Single Dynamic Active Step Number Indicator */}
        <div className="flex items-center gap-2 text-accent font-bold">
          <span data-hero-progress-num className="font-mono text-[11px] tracking-wider">
            01
          </span>
          <span className="h-px w-2 bg-accent" />
        </div>
      </div>
    </aside>
  );
}
