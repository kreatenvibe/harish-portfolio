import { ReactNode } from "react";

interface FrameProps {
  children: ReactNode;
  label?: string;
  frameIndex?: string | number;
  timecode?: string;
  className?: string;
  showCorners?: boolean;
  border?: boolean;
}

export function Frame({
  children,
  label,
  frameIndex,
  timecode,
  className = "",
  showCorners = true,
  border = true,
}: FrameProps) {
  const formattedIndex =
    frameIndex !== undefined
      ? `FR_${String(frameIndex).padStart(3, "0")}`
      : undefined;

  return (
    <div
      className={`relative ${
        border ? "border border-line/60 bg-surface/30" : ""
      } ${className}`}
    >
      {/* 4 Precision Corner Marks */}
      {showCorners && (
        <>
          <span className="frame-corner-tl" aria-hidden="true" />
          <span className="frame-corner-tr" aria-hidden="true" />
          <span className="frame-corner-bl" aria-hidden="true" />
          <span className="frame-corner-br" aria-hidden="true" />
        </>
      )}

      {/* Frame Header Bar if metadata provided */}
      {(label || formattedIndex || timecode) && (
        <div className="flex items-center justify-between border-b border-line/40 px-4 py-2 font-mono text-[9px] tracking-widest text-muted/70 uppercase">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{label || "FRAME"}</span>
          </div>
          <div className="flex items-center gap-4 text-muted/60">
            {timecode && <span>{timecode}</span>}
            {formattedIndex && <span className="text-foreground/70 font-semibold">{formattedIndex}</span>}
          </div>
        </div>
      )}

      {/* Frame Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
