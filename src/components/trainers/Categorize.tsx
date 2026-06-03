import { useState } from 'react';
import TrainerShell, { type ReviewItem, type ShellRenderProps, type TrainerNav } from './TrainerShell';
import { scoreCategorize } from '../../lib/trainers/score';
import { shuffleArray } from '../../lib/trainers/shuffle';

export interface CategorizeCategory {
  id: string;
  label: string;
}

export interface CategorizeItem {
  text: string;
  category: string;
  explain?: string;
}

export default function Categorize({
  slug,
  categories,
  items,
  nav,
}: {
  slug: string;
  categories: CategorizeCategory[];
  items: CategorizeItem[];
  nav?: TrainerNav;
}) {
  return (
    <TrainerShell slug={slug} total={items.length} nav={nav}>
      {(shell) => (
        <CategorizeBody
          key={shell.attempt}
          categories={categories}
          items={items}
          shell={shell}
        />
      )}
    </TrainerShell>
  );
}

function CategorizeBody({
  categories,
  items,
  shell,
}: {
  categories: CategorizeCategory[];
  items: CategorizeItem[];
  shell: ShellRenderProps;
}) {
  const { finish } = shell;
  // Перемешиваем элементы один раз на заход, чтобы порядок/группировку нельзя было угадать.
  const [shuffledItems] = useState(() => shuffleArray(items));
  const [picks, setPicks] = useState<Map<string, string>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [warn, setWarn] = useState(false);

  function pick(text: string, categoryId: string) {
    if (revealed) return;
    setWarn(false);
    setPicks((prev) => {
      const next = new Map(prev);
      next.set(text, categoryId);
      return next;
    });
  }
  const allPicked = shuffledItems.every((it) => picks.has(it.text));
  const categoryLabel = (id?: string) =>
    (id && categories.find((c) => c.id === id)?.label) || '—';

  function reveal() {
    if (!allPicked) {
      setWarn(true);
      return;
    }
    setRevealed(true);
  }

  function complete() {
    const score = scoreCategorize(shuffledItems, picks).score;
    const review: ReviewItem[] = shuffledItems.map((it) => {
      const userId = picks.get(it.text);
      return {
        prompt: it.text,
        userAnswer: categoryLabel(userId),
        correctAnswer: categoryLabel(it.category),
        correct: userId === it.category,
        explain: it.explain,
      };
    });
    finish(score, review);
  }

  return (
    <div className="kc-categorize">
      <div className="kc-categ-items">
        {shuffledItems.map((it) => {
          const picked = picks.get(it.text);
          const correct = revealed && picked === it.category;
          const wrong = revealed && picked && picked !== it.category;
          return (
            <div
              key={it.text}
              className={`kc-categ-item ${correct ? 'is-ok' : ''} ${wrong ? 'is-no' : ''}`}
            >
              <div className="kc-categ-text">{it.text}</div>
              <div className="kc-categ-buckets">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`kc-categ-bucket ${picked === c.id ? 'is-picked' : ''}`}
                    onClick={() => pick(it.text, c.id)}
                    disabled={revealed}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {revealed && it.explain && (
                <div className="kc-categ-explain">{it.explain}</div>
              )}
            </div>
          );
        })}
      </div>
      {warn && !revealed && (
        <div className="kc-warn" role="alert">
          Распредели все элементы — без пропусков.
        </div>
      )}
      <div className="kc-categ-actions">
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
