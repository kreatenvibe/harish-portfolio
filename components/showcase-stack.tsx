import { Code, Robot, ChartBar } from "@phosphor-icons/react/dist/ssr";

const CARDS = [
  { tone: "is-ink", label: "Software", Icon: Code },
  { tone: "is-accent", label: "Automation", Icon: Robot },
  { tone: "is-stone", label: "Insights", Icon: ChartBar },
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
