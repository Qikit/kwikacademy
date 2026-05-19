import { useState, type ReactNode } from 'react';
import { createStore } from '../../lib/progress/store';

export interface ShellRenderProps {
  index: number;
  total: number;
  next: () => void;
  finish: (score: number) => void;
}

export default function TrainerShell({
  slug,
  total,
  children,
}: {
  slug: string;
  total: number;
  children: (p: ShellRenderProps) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState<null | number>(null);

  function next() {
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function finish(score: number) {
    setFinished(score);
    createStore().recordTrainerResult({ trainerSlug: slug, score, total, completedAt: Date.now() });
  }

  function restart() {
    setIndex(0);
    setFinished(null);
  }

  if (finished !== null) {
    const pct = Math.round((finished / total) * 100);
    return (
      <div className="kc-trainer-result">
        <div className="kc-pct-big">{pct}%</div>
        <p>
          {finished} из {total} верно
        </p>
        <button onClick={restart} className="kc-retry">
          Пройти заново
        </button>
      </div>
    );
  }

  return (
    <div className="kc-trainer">
      <div className="kc-trk">
        <i style={{ width: `${(index / total) * 100}%` }} />
      </div>
      {children({ index, total, next, finish })}
    </div>
  );
}
