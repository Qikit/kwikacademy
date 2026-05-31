import { useState } from 'react';
import TrainerShell, { type ReviewItem, type ShellRenderProps, type TrainerNav } from './TrainerShell';
import Select, { type SelectOption } from '../ui/Select';
import { scoreMatch } from '../../lib/trainers/score';

export interface MatchPair {
  left: string;
  right: string;
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

// Несколько маркеров могут указывать на один ответ (классификация),
// поэтому варианты в списке — только уникальные правые значения, без повторов.
function uniqueRights(pairs: MatchPair[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of pairs) {
    if (!seen.has(p.right)) {
      seen.add(p.right);
      out.push(p.right);
    }
  }
  return out;
}

export default function Match({
  slug,
  pairs,
  nav,
}: {
  slug: string;
  pairs: MatchPair[];
  nav?: TrainerNav;
}) {
  return (
    <TrainerShell slug={slug} total={pairs.length} nav={nav}>
      {(shell) => <MatchBody key={shell.attempt} pairs={pairs} shell={shell} />}
    </TrainerShell>
  );
}

function MatchBody({ pairs, shell }: { pairs: MatchPair[]; shell: ShellRenderProps }) {
  const { finish } = shell;
  const correct = Object.fromEntries(pairs.map((p) => [p.left, p.right]));
  const [options] = useState<SelectOption[]>(() =>
    shuffle(uniqueRights(pairs)).map((r) => ({ value: r, label: r })),
  );
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [warn, setWarn] = useState(false);

  function set(left: string, right: string) {
    if (revealed) return;
    setWarn(false);
    setPicked((p) => ({ ...p, [left]: right }));
  }
  const allSet = pairs.every((p) => picked[p.left]);

  function check() {
    if (!allSet) {
      setWarn(true);
      return;
    }
    setRevealed(true);
  }

  function complete() {
    const score = scoreMatch(correct, picked).score;
    const review: ReviewItem[] = pairs.map((p) => ({
      prompt: p.left,
      userAnswer: picked[p.left] ?? '—',
      correctAnswer: p.right,
      correct: picked[p.left] === p.right,
      explain: p.explain,
    }));
    finish(score, review);
  }

  return (
    <div className="kc-match">
      {pairs.map((p) => {
        const userPick = picked[p.left];
        const ok = revealed && userPick === p.right;
        const wrong = revealed && userPick && userPick !== p.right;
        return (
          <div
            key={p.left}
            className={`kc-match-row ${ok ? 'is-ok' : ''} ${wrong ? 'is-no' : ''}`}
          >
            <span className="kc-match-left">{p.left}</span>
            <Select
              options={options}
              value={userPick ?? ''}
              onChange={(v) => set(p.left, v)}
              ariaLabel={`Пара для «${p.left}»`}
              disabled={revealed}
              status={revealed ? (ok ? 'ok' : wrong ? 'no' : undefined) : undefined}
            />
            {revealed && wrong && (
              <div className="kc-match-correct">
                Правильно: <strong>{p.right}</strong>
              </div>
            )}
          </div>
        );
      })}

      {warn && !revealed && (
        <div className="kc-warn" role="alert">
          Заполни все пары — пустые значения не принимаются.
        </div>
      )}

      <div className="kc-match-actions">
        {!revealed ? (
          <button type="button" className="kc-retry" onClick={check}>
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
