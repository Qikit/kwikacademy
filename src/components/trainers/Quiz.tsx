import { useState } from 'react';
import TrainerShell, { type ReviewItem, type TrainerNav } from './TrainerShell';
import { scoreQuiz } from '../../lib/trainers/score';

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explain?: string;
}

export default function Quiz({
  slug,
  questions,
  nav,
}: {
  slug: string;
  questions: QuizQuestion[];
  nav?: TrainerNav;
}) {
  const [picks, setPicks] = useState<number[]>([]);

  return (
    <TrainerShell slug={slug} total={questions.length} nav={nav}>
      {({ index, next, prev, canGoBack, finish }) => {
        const q = questions[index];
        const picked = picks[index];
        const revealed = typeof picked === 'number';

        function choose(i: number) {
          if (revealed) return;
          const copy = [...picks];
          copy[index] = i;
          setPicks(copy);
        }

        function advance() {
          if (index === questions.length - 1) {
            const correctIndices = questions.map((x) => x.correctIndex);
            const score = scoreQuiz(picks, correctIndices).score;
            const review: ReviewItem[] = questions.map((qq, i) => ({
              prompt: qq.prompt,
              userAnswer: typeof picks[i] === 'number' ? qq.options[picks[i]] : '—',
              correctAnswer: qq.options[qq.correctIndex],
              correct: picks[i] === qq.correctIndex,
              explain: qq.explain,
            }));
            finish(score, review);
          } else {
            next();
          }
        }

        return (
          <div>
            <div className="kc-q">{q.prompt}</div>
            {q.options.map((opt, i) => {
              let cls = 'kc-opt';
              if (revealed && i === q.correctIndex) cls += ' correct';
              else if (revealed && i === picked) cls += ' wrong';
              return (
                <button key={i} className={cls} onClick={() => choose(i)}>
                  {opt}
                </button>
              );
            })}
            {revealed && q.explain && (
              <p style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 8 }}>{q.explain}</p>
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
              {revealed && (
                <button type="button" className="kc-retry" onClick={advance}>
                  {index === questions.length - 1 ? 'Завершить' : 'Дальше'}
                </button>
              )}
            </div>
          </div>
        );
      }}
    </TrainerShell>
  );
}
