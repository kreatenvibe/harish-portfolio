import { PaintBrush, FilmSlate, Palette } from "@phosphor-icons/react/dist/ssr";

const CARDS = [
  { tone: "is-ink", label: "Paint & Roto", Icon: PaintBrush },
  { tone: "is-accent", label: "VFX", Icon: FilmSlate },
  { tone: "is-stone", label: "Design", Icon: Palette },
] as const;

export function ShowcaseStack() {
  return (
    <div className="stack-wrap" aria-hidden="true">
      {CARDS.map(({ tone, label, Icon }) => (
        <div key={tone} className={`stack-card ${tone}`}>
          <div className="stack-content">
            <Icon weight="light" />
            <span className="stack-label">{label}</span>
          </div>
        </div>
      ))}

      <div className="stack-lines">
        <div className="stack-line" />
        <div className="stack-line" />
      </div>
    </div>
  );
}
