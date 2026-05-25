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

  return (
    <TrainerShell slug={slug} total={items.length} nav={nav}>
      {({ index, next, prev, canGoBack, finish }) => {
        const it = items[index];
        const isLast = index === items.length - 1;
        const r = results[index];

        function setVal(b: number, v: string) {
          if (r) return;
          const copy = inputs.map((row) => [...row]);
          copy[index][b] = v;
          setInputs(copy);
        }

        function check(): boolean {
          const current = inputs[index];
          if (current.some((v) => v.trim() === '')) return false;
          const perBlank = it.answers.map((ans, i) => norm(ans) === norm(current[i] ?? ''));
          const itemCorrect = perBlank.every(Boolean);
          const updated = [...results];
          updated[index] = { correct: perBlank, itemCorrect };
          setResults(updated);
          return true;
        }

        function advance() {
          if (!isLast) {
            next();
            return;
          }
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
        }

        return (
          <ItemView
            key={index}
            item={it}
            values={inputs[index]}
            result={r}
            isLast={isLast}
            canGoBack={canGoBack}
            onChangeValue={setVal}
            onCheck={check}
            onPrev={prev}
            onAdvance={advance}
          />
        );
      }}
    </TrainerShell>
  );
}

function ItemView({
  item,
  values,
  result,
  isLast,
  canGoBack,
  onChangeValue,
  onCheck,
  onPrev,
  onAdvance,
}: {
  item: ClozeItem;
  values: string[];
  result: ItemResult | undefined;
  isLast: boolean;
  canGoBack: boolean;
  onChangeValue: (b: number, v: string) => void;
  onCheck: () => boolean;
  onPrev: () => void;
  onAdvance: () => void;
}) {
  const [warn, setWarn] = useState(false);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const phase: 'fill' | 'review' = result ? 'review' : 'fill';
  const parts = item.text.split('___');

  useEffect(() => {
    if (phase === 'fill') {
      const id = window.setTimeout(() => firstInputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  function check() {
    const ok = onCheck();
    if (!ok) setWarn(true);
  }

  function handleChange(b: number, v: string) {
    setWarn(false);
    onChangeValue(b, v);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (phase === 'fill') check();
    else onAdvance();
  }

  return (
    <div className="kc-cloze">
      <p className="kc-cloze-text">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 && (() => {
              const correct = phase === 'review' && result?.correct[i];
              const wrong = phase === 'review' && result && !result.correct[i];
              return (
                <input
                  ref={i === 0 ? firstInputRef : undefined}
                  value={values[i] ?? ''}
                  onChange={(e) => handleChange(i, e.target.value)}
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

      {item.hint && phase === 'fill' && (
        <p className="kc-cloze-hint">Подсказка: {item.hint}</p>
      )}

      {phase === 'review' && result && (
        <div className={`kc-cloze-feedback ${result.itemCorrect ? 'is-ok' : 'is-no'}`}>
          <div className="kc-cloze-feedback-head">
            {result.itemCorrect ? 'Верно' : 'Ошибка'}
          </div>
          {!result.itemCorrect && (
            <div className="kc-cloze-correct">
              Правильно: {item.answers.map((a, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  <strong>{a}</strong>
                </span>
              ))}
            </div>
          )}
          {item.explain && <div className="kc-cloze-explain">{item.explain}</div>}
        </div>
      )}

      {warn && phase === 'fill' && (
        <div className="kc-warn" role="alert">
          Заполни все пропуски — пустые поля не принимаются.
        </div>
      )}

      <div className="kc-nav-row">
        <button type="button" className="kc-btn kc-btn-ghost" onClick={onPrev} disabled={!canGoBack}>
          Назад
        </button>
        {phase === 'fill' ? (
          <button type="button" className="kc-retry" onClick={check}>
            Проверить
          </button>
        ) : (
          <button type="button" className="kc-retry" onClick={onAdvance}>
            {isLast ? 'Завершить' : 'Дальше'}
          </button>
        )}
      </div>
    </div>
  );
}
