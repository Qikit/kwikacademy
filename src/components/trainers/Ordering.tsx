import { useEffect, useMemo, useState } from 'react';
import TrainerShell, { type ReviewItem, type ShellRenderProps, type TrainerNav } from './TrainerShell';
import { scoreOrdering } from '../../lib/trainers/score';

export interface OrderingItem {
  task?: string;
  words: string[];
  answer: string[];
  hint?: string;
  translation?: string;
  explain?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Ordering({
  slug,
  items,
  code = false,
  nav,
}: {
  slug: string;
  items: OrderingItem[];
  code?: boolean;
  nav?: TrainerNav;
}) {
  return (
    <TrainerShell slug={slug} total={items.length} nav={nav}>
      {(shell) => <OrderingBody key={shell.attempt} items={items} code={code} shell={shell} />}
    </TrainerShell>
  );
}

function OrderingBody({
  items,
  code,
  shell,
}: {
  items: OrderingItem[];
  code: boolean;
  shell: ShellRenderProps;
}) {
  const { finish } = shell;
  const same = (expected: string, got: string) =>
    code ? expected === got : expected.trim().toLowerCase() === got.trim().toLowerCase();
  const show = (parts: string[]) => (code ? <pre className="kc-ord-code">{parts.join('\n')}</pre> : parts.join(' '));
  const shuffled = useMemo(
    () => items.map((it) => shuffle(it.words.map((w, idx) => ({ w, idx })))),
    [items],
  );
  const [assembled, setAssembled] = useState<Map<number, { w: string; idx: number }[]>>(new Map());
  const [available, setAvailable] = useState<Map<number, { w: string; idx: number }[]>>(
    new Map(shuffled.map((s, i) => [i, s])),
  );
  const [revealed, setRevealed] = useState(false);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    setAssembled(new Map());
    setAvailable(new Map(shuffled.map((s, i) => [i, s])));
    setRevealed(false);
    setWarn(false);
  }, [shuffled]);

  function moveToAssembled(itemIdx: number, token: { w: string; idx: number }) {
    if (revealed) return;
    setWarn(false);
    setAvailable((prev) => {
      const next = new Map(prev);
      next.set(itemIdx, (prev.get(itemIdx) ?? []).filter((t) => t.idx !== token.idx));
      return next;
    });
    setAssembled((prev) => {
      const next = new Map(prev);
      next.set(itemIdx, [...(prev.get(itemIdx) ?? []), token]);
      return next;
    });
  }

  function moveToAvailable(itemIdx: number, token: { w: string; idx: number }) {
    if (revealed) return;
    setWarn(false);
    setAssembled((prev) => {
      const next = new Map(prev);
      next.set(itemIdx, (prev.get(itemIdx) ?? []).filter((t) => t.idx !== token.idx));
      return next;
    });
    setAvailable((prev) => {
      const next = new Map(prev);
      next.set(itemIdx, [...(prev.get(itemIdx) ?? []), token]);
      return next;
    });
  }

  const allAssembled = items.every(
    (it, i) => (assembled.get(i)?.length ?? 0) === it.words.length,
  );
  function reveal() {
    if (!allAssembled) {
      setWarn(true);
      return;
    }
    setRevealed(true);
  }
  function complete() {
    const userAnswers = new Map<number, string[]>();
    for (const [idx, tokens] of assembled.entries()) {
      userAnswers.set(
        idx,
        tokens.map((t) => t.w),
      );
    }
    const score = scoreOrdering(items, userAnswers, code).score;
    const review: ReviewItem[] = items.map((it, i) => {
      const userSeq = (assembled.get(i) ?? []).map((t) => t.w);
      const isOk = userSeq.length === it.answer.length && it.answer.every((w, j) => same(w, userSeq[j] ?? ''));
      const explainParts = [it.translation, it.explain, it.hint].filter(Boolean).join(' · ');
      return {
        prompt: it.task ?? (code ? `Задание ${i + 1}` : `Слова: ${it.words.join(' / ')}`),
        userAnswer: userSeq.length ? show(userSeq) : '—',
        correctAnswer: show(it.answer),
        correct: isOk,
        explain: explainParts || undefined,
      };
    });
    finish(score, review);
  }

  return (
    <div className={`kc-ordering ${code ? 'is-code' : ''}`}>
      {items.map((it, i) => {
        const a = assembled.get(i) ?? [];
        const av = available.get(i) ?? [];
        const userSeq = a.map((t) => t.w);
        const correct = revealed && userSeq.length === it.answer.length &&
          it.answer.every((w, j) => same(w, userSeq[j] ?? ''));
        return (
          <div
            key={i}
            className={`kc-ord-item ${revealed && correct ? 'is-ok' : ''} ${revealed && !correct ? 'is-no' : ''}`}
          >
            {it.task && <div className="kc-ord-task">{it.task}</div>}
            <div className="kc-ord-target">
              {a.length === 0 && <span className="kc-ord-placeholder">— нажми слова ниже —</span>}
              {a.map((t) => (
                <button
                  type="button"
                  key={t.idx}
                  className="kc-ord-token kc-ord-token-target"
                  onClick={() => moveToAvailable(i, t)}
                  disabled={revealed}
                >
                  {t.w}
                </button>
              ))}
            </div>
            <div className="kc-ord-pool">
              {av.map((t) => (
                <button
                  type="button"
                  key={t.idx}
                  className="kc-ord-token"
                  onClick={() => moveToAssembled(i, t)}
                  disabled={revealed}
                >
                  {t.w}
                </button>
              ))}
            </div>
            {revealed && (
              <div className="kc-ord-feedback">
                <div>
                  <strong>Правильный порядок:</strong> {show(it.answer)}
                </div>
                {it.translation && (
                  <div className="kc-ord-translation">{it.translation}</div>
                )}
                {it.hint && <div className="kc-ord-hint">{it.hint}</div>}
              </div>
            )}
          </div>
        );
      })}
      {warn && !revealed && (
        <div className="kc-warn" role="alert">
          Собери все предложения до конца — пустых не должно быть.
        </div>
      )}
      <div className="kc-ord-actions">
        {!revealed ? (
          <button type="button" className="kc-retry" onClick={reveal}>
            Проверить
          </button>
        ) : (
          <button type="button" className="kc-retry" onClick={complete}>
            Завершить
          </button>
        )}
      </div>
    </div>
  );
}
