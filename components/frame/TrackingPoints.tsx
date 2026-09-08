interface TrackingPointProps {
  className?: string;
  variant?: "cross" | "target" | "dot" | "bracket";
  label?: string;
}

export function TrackingPoint({
  className = "",
  variant = "cross",
  label,
}: TrackingPointProps) {
  return (
    <div
      className={`absolute pointer-events-none z-20 flex items-center gap-1.5 font-mono text-[9px] text-muted/50 select-none ${className}`}
      aria-hidden="true"
    >
      {variant === "cross" && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/40"
        >
          <line x1="5" y1="1" x2="5" y2="9" />
          <line x1="1" y1="5" x2="9" y2="5" />
        </svg>
      )}

      {variant === "target" && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/35"
        >
          <circle cx="6" cy="6" r="3.5" strokeDasharray="1.5 1.5" />
          <line x1="6" y1="1" x2="6" y2="11" />
          <line x1="1" y1="6" x2="11" y2="6" />
        </svg>
      )}

      {variant === "bracket" && (
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/30"
        >
          <path d="M1 3V1H3" />
          <path d="M5 1H7V3" />
          <path d="M1 5V7H3" />
          <path d="M5 7H7V5" />
        </svg>
      )}

      {variant === "dot" && (
        <span className="h-1 w-1 rounded-full bg-white/40" />
      )}

      {label && <span className="tracking-widest uppercase text-[8px] text-white/30">{label}</span>}
    </div>
  );
}

export function TrackingGridOverlay({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <TrackingPoint className="top-4 left-4" variant="bracket" />
      <TrackingPoint className="top-4 right-4" variant="bracket" />
      <TrackingPoint className="bottom-4 left-4" variant="bracket" />
      <TrackingPoint className="bottom-4 right-4" variant="bracket" />
    </div>
  );
}
