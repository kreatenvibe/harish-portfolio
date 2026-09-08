interface FrameCounterProps {
  index: string | number;
  label: string;
  className?: string;
  total?: number;
}

export function FrameCounter({
  index,
  label,
  className = "",
  total = 7,
}: FrameCounterProps) {
  const formattedIndex = typeof index === "number" ? String(index).padStart(2, "0") : index;
  const formattedTotal = String(total).padStart(2, "0");

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 text-foreground/80 font-semibold">
        <span className="h-1 w-1 rounded-full bg-white/70" />
        <span>FRAME {formattedIndex}</span>
      </div>
      <span className="text-line">/</span>
      <span className="text-muted/40">{formattedTotal}</span>
      <span className="text-line">{"//"}</span>
      <span className="text-muted/70 font-medium">{label}</span>
    </div>
  );
}
