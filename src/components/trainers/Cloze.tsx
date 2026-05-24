import { useState } from 'react';
import TrainerShell, { type TrainerNav } from './TrainerShell';
import { scoreCloze } from '../../lib/trainers/score';

export interface ClozeItem {
  text: string; // each blank marked with "___"
  answers: string[];
}

export default function Cloze({
  slug,
  items,
  nav,
}: {
  slug: string;
  items: ClozeItem[];
  nav?: TrainerNav;
}) {
  const [inputs, setInputs] = useState<string[][]>(() => items.map((it) => it.answers.map(() => '')));

  return (
    <TrainerShell slug={slug} total={items.length} nav={nav}>
      {({ index, next, finish }) => {
        const it = items[index];
        const parts = it.text.split('___');

        function setVal(b: number, v: string) {
          const copy = inputs.map((row) => [...row]);
          copy[index][b] = v;
          setInputs(copy);
        }

        function advance() {
          if (index === items.length - 1) {
            finish(scoreCloze(items.map((x) => x.answers), inputs).score);
          } else {
            next();
          }
        }

        return (
          <div>
            <p style={{ fontSize: 17, lineHeight: 2, color: 'var(--text)' }}>
              {parts.map((p, i) => (
                <span key={i}>
                  {p}
                  {i < parts.length - 1 && (
                    <input
                      value={inputs[index][i] ?? ''}
                      onChange={(e) => setVal(i, e.target.value)}
                      aria-label={`Пропуск ${i + 1}`}
                      style={{
                        width: 90,
                        margin: '0 4px',
                        padding: '4px 8px',
                        borderRadius: 8,
                        border: '1px solid var(--glass-border)',
                        background: 'var(--glass-bg)',
                        color: 'var(--text)',
                      }}
                    />
                  )}
                </span>
              ))}
            </p>
            <button className="kc-retry" style={{ marginTop: 16 }} onClick={advance}>
              {index === items.length - 1 ? 'Завершить' : 'Дальше'}
            </button>
          </div>
        );
      }}
    </TrainerShell>
  );
}
