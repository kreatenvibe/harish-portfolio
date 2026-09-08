"use client";

import { useEffect, useRef } from "react";

export function Timecode({ className = "" }: { className?: string }) {
  const timecodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateTimecode = () => {
      if (!timecodeRef.current) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      // Map progress to a 24fps timeline (00:00:00:00 to 00:04:18:23)
      const totalFrames = Math.floor(progress * 6200);
      const frames = totalFrames % 24;
      const totalSeconds = Math.floor(totalFrames / 24);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`;

      if (timecodeRef.current.textContent !== formatted) {
        timecodeRef.current.textContent = formatted;
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateTimecode);
    };

    updateTimecode();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted/60 select-none ${className}`}
      aria-label="Composition Timeline Position"
    >
      <span className="signal-dot shrink-0" />
      <span className="text-muted/40">TC:</span>
      <span ref={timecodeRef} className="text-foreground/75 font-medium tabular-nums">
        00:00:00:00
      </span>
    </div>
  );
}
