interface FrameCounterProps {
  index?: string | number;
  label: string;
  className?: string;
  total?: number;
}

export function FrameCounter({
  index,
  label,
  className = "",
}: FrameCounterProps) {
  const formattedIndex =
    index !== undefined
      ? typeof index === "number"
        ? String(index).padStart(2, "0")
        : index
      : null;

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 text-foreground font-semibold">
        <span className="h-1 w-1 rounded-full bg-white" />
        {formattedIndex && <span>{formattedIndex}</span>}
      </div>
      {formattedIndex && <span className="text-line">/</span>}
      <span className="text-muted font-medium tracking-widest">{label}</span>
    </div>
  );
}

