import { useState } from 'react';

interface Axis {
  label: string;
  low: string;
  high: string;
}
interface Cell {
  title: string;
  note?: string;
  color?: string;
}
interface Props {
  xAxis: Axis;
  yAxis: Axis;
  cells: Cell[];
}

// cells order follows the visual grid: [0] top-left (yHigh·xLow), [1] top-right (yHigh·xHigh),
// [2] bottom-left (yLow·xLow), [3] bottom-right (yLow·xHigh).
export default function Quadrant({ xAxis, yAxis, cells }: Props) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="kc-qd">
      <div className="kc-qd-grid">
        {cells.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`kc-qd-cell${active === i ? ' active' : ''}`}
            style={c.color ? ({ ['--qd-accent']: `var(--c-${c.color})` } as React.CSSProperties) : undefined}
            onClick={() => setActive(active === i ? null : i)}
            aria-pressed={active === i}
          >
            <span className="kc-qd-cell-title">{c.title}</span>
          </button>
        ))}
      </div>
      <div className="kc-qd-axes">
        <span className="kc-qd-ax">↕ {yAxis.label}: {yAxis.high} / {yAxis.low}</span>
        <span className="kc-qd-ax">↔ {xAxis.label}: {xAxis.low} / {xAxis.high}</span>
      </div>
      {active !== null && cells[active].note && (
        <div className="kc-qd-note">
          <strong>{cells[active].title}.</strong> {cells[active].note}
        </div>
      )}
    </div>
  );
}
