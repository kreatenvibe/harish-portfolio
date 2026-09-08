export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
        tone === "light"
          ? "border-line bg-surface text-foreground"
          : "border-white/15 bg-white/5 text-white/70"
      }`}
    >
      <span
        className={`h-1 w-1 rounded-full ${
          tone === "light" ? "bg-white/70" : "bg-white/50"
        }`}
      />
      {children}
    </span>
  );
}
