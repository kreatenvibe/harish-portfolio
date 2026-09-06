import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent ${className}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
      <span>{children}</span>
    </div>
  );
}
