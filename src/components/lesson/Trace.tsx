import { useState } from 'react';

interface Step {
  actor?: string;
  label: string;
  detail?: string;
}
interface Props {
  steps: Step[];
  caption?: string;
}

const ACTOR_COLOR: Record<string, string> = {
  user: 'blue',
  think: 'violet',
  tool: 'gold',
  result: 'teal',
  answer: 'rose',
  step: 'indigo',
};

export default function Trace({ steps, caption }: Props) {
  const [current, setCurrent] = useState(0);
  const shown = steps.slice(0, current + 1);
  return (
    <div className="kc-tr">
      {caption && <div className="kc-tr-caption">{caption}</div>}
      <div className="kc-tr-steps">
        {shown.map((s, i) => (
          <div key={i} className="kc-tr-step">
            {s.actor && (
              <span
                className="kc-tr-badge"
                style={{ ['--tr-accent']: `var(--c-${ACTOR_COLOR[s.actor] ?? 'indigo'})` } as React.CSSProperties}
              >
                {s.actor}
              </span>
            )}
            <div className="kc-tr-body">
              <div className="kc-tr-label">{s.label}</div>
              {s.detail && <div className="kc-tr-detail">{s.detail}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="kc-tr-nav">
        <button
          type="button"
          className="kc-btn kc-btn-ghost"
          onClick={() => setCurrent(0)}
          disabled={current === 0}
        >
          Сначала
        </button>
        <span className="kc-tr-progress">
          Шаг {current + 1} из {steps.length}
        </span>
        <button
          type="button"
          className="kc-btn kc-btn-ghost"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          Назад
        </button>
        <button
          type="button"
          className="kc-btn kc-btn-primary"
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={current === steps.length - 1}
        >
          Дальше
        </button>
      </div>
    </div>
  );
}
