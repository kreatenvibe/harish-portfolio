export function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
        tone === "dark"
          ? "border-white/15 bg-white/5 text-white/70"
          : "border-accent/20 bg-accent/[0.06] text-accent"
      }`}
    >
      {children}
    </span>
  );
}
