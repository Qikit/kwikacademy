import { useState } from 'react';
import TrainerShell from './TrainerShell';
import { scoreMatch } from '../../lib/trainers/score';

export interface MatchPair {
  left: string;
  right: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Match({ slug, pairs }: { slug: string; pairs: MatchPair[] }) {
  const correct = Object.fromEntries(pairs.map((p) => [p.left, p.right]));
  const [rights] = useState(() => shuffle(pairs.map((p) => p.right)));
  const [picked, setPicked] = useState<Record<string, string>>({});

  return (
    <TrainerShell slug={slug} total={pairs.length}>
      {({ finish }) => {
        function set(left: string, right: string) {
          setPicked((p) => ({ ...p, [left]: right }));
        }
        const allSet = pairs.every((p) => picked[p.left]);

        return (
          <div>
            {pairs.map((p) => (
              <div key={p.left} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <span style={{ flex: 1, fontWeight: 600, color: 'var(--text)' }}>{p.left}</span>
                <select
                  value={picked[p.left] ?? ''}
                  onChange={(e) => set(p.left, e.target.value)}
                  aria-label={`Пара для «${p.left}»`}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--glass-bg)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="">— выбери —</option>
                  {rights.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              className="kc-retry"
              style={{ marginTop: 16 }}
              disabled={!allSet}
              onClick={() => finish(scoreMatch(correct, picked).score)}
            >
              Завершить
            </button>
          </div>
        );
      }}
    </TrainerShell>
  );
}
