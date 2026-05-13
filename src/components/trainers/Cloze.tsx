import { useEffect, useRef, useState } from 'react';
import TrainerShell, { type ReviewItem, type TrainerNav } from './TrainerShell';

export interface ClozeItem {
  text: string;
  answers: string[];
  explain?: string;
  hint?: string;
}

const norm = (s: string) => s.trim().toLowerCase();

interface ItemResult {
  correct: boolean[];
  itemCorrect: boolean;
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
  const [results, setResults] = useState<(ItemResult | undefined)[]>(() => items.map(() => undefined));
  const [warn, setWarn] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <TrainerShell slug={slug} total={items.length} nav={nav}>
      {({ index, next, prev, canGoBack, finish }) => {
        const it = items[index];
        const parts = it.text.split('___');
        const isLast = index === items.length - 1;
        const r = results[index];
        const phase: 'fill' | 'review' = r ? 'review' : 'fill';

        useEffect(() => {
          setWarn(false);
          if (phase === 'fill') setTimeout(() => firstInputRef.current?.focus(), 0);
        }, [index]);

        function setVal(b: number, v: string) {
          if (phase === 'review') return;
          setWarn(false);
          const copy = inputs.map((row) => [...row]);
          copy[index][b] = v;
          setInputs(copy);
        }

        function check() {
          const current = inputs[index];
          if (current.some((v) => v.trim() === '')) {
            setWarn(true);
            return;
          }
          const perBlank = it.answers.map((ans, i) => norm(ans) === norm(current[i] ?? ''));
          const itemCorrect = perBlank.every(Boolean);
          const updated = [...results];
          updated[index] = { correct: perBlank, itemCorrect };
          setResults(updated);
        }

        function advance() {
          if (isLast) {
            const review: ReviewItem[] = items.map((item, i) => {
              const filled = item.text.split('___').reduce<string>((acc, part, j) => {
                if (j === 0) return part;
                const ans = item.answers[j - 1];
                return acc + ` [${ans}] ` + part;
              }, '');
              const userFilled = item.text.split('___').reduce<string>((acc, part, j) => {
                if (j === 0) return part;
                const v = (inputs[i][j - 1] ?? '').trim() || '—';
                return acc + ` [${v}] ` + part;
              }, '');
              return {
                prompt: item.text,
                userAnswer: userFilled,
                correctAnswer: filled,
                correct: results[i]?.itemCorrect ?? false,
                explain: item.explain,
              };
            });
            const score = results.reduce<number>((acc, x) => acc + (x?.itemCorrect ? 1 : 0), 0);
            finish(score, review);
            return;
          }
          next();
        }

        function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          if (phase === 'fill') check();
          else advance();
        }

        return (
          <div className="kc-cloze">
            <p className="kc-cloze-text">
              {parts.map((p, i) => (
                <span key={i}>
                  {p}
                  {i < parts.length - 1 && (() => {
                    const correct = phase === 'review' && r?.correct[i];
                    const wrong = phase === 'review' && r && !r.correct[i];
                    return (
                      <input
                        ref={i === 0 ? firstInputRef : undefined}
                        value={inputs[index][i] ?? ''}
                        onChange={(e) => setVal(i, e.target.value)}
                        onKeyDown={onKey}
                        disabled={phase === 'review'}
                        aria-label={`Пропуск ${i + 1}`}
                        autoComplete="off"
                        spellCheck={false}
                        className={`kc-cloze-input ${correct ? 'is-ok' : ''} ${wrong ? 'is-no' : ''}`}
                      />
                    );
                  })()}
                </span>
              ))}
            </p>

            {it.hint && phase === 'fill' && (
              <p className="kc-cloze-hint">Подсказка: {it.hint}</p>
            )}

            {phase === 'review' && r && (
              <div className={`kc-cloze-feedback ${r.itemCorrect ? 'is-ok' : 'is-no'}`}>
                <div className="kc-cloze-feedback-head">
                  {r.itemCorrect ? 'Верно' : 'Ошибка'}
                </div>
                {!r.itemCorrect && (
                  <div className="kc-cloze-correct">
                    Правильно: {it.answers.map((a, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        <strong>{a}</strong>
                      </span>
                    ))}
                  </div>
                )}
                {it.explain && <div className="kc-cloze-explain">{it.explain}</div>}
              </div>
            )}

            {warn && phase === 'fill' && (
              <div className="kc-warn" role="alert">
                Заполни все пропуски — пустые поля не принимаются.
              </div>
            )}

            <div className="kc-nav-row">
              <button
                type="button"
                className="kc-btn kc-btn-ghost"
                onClick={prev}
                disabled={!canGoBack}
              >
                Назад
              </button>
              {phase === 'fill' ? (
                <button type="button" className="kc-retry" onClick={check}>
                  Проверить
                </button>
              ) : (
                <button type="button" className="kc-retry" onClick={advance}>
                  {isLast ? 'Завершить' : 'Дальше'}
                </button>
              )}
            </div>
          </div>
        );
      }}
    </TrainerShell>
  );
}
