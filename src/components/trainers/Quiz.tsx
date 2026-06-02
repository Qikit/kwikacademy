import { useState } from 'react';
import TrainerShell, { type ReviewItem, type ShellRenderProps, type TrainerNav } from './TrainerShell';
import { scoreQuiz } from '../../lib/trainers/score';
import { shuffleOptions } from '../../lib/trainers/shuffle';

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
  return (
    <TrainerShell slug={slug} total={questions.length} nav={nav}>
      {(shell) => <QuizBody key={shell.attempt} questions={questions} shell={shell} />}
    </TrainerShell>
  );
}

function QuizBody({ questions, shell }: { questions: QuizQuestion[]; shell: ShellRenderProps }) {
  const { index, next, prev, canGoBack, finish } = shell;
  // Перемешиваем варианты один раз на заход: инициализатор useState выполняется
  // при mount, а смена attempt (кнопка «Заново») ремаунтит компонент → новый порядок.
  const [shuffled] = useState(() =>
    questions.map((qq) => {
      const s = shuffleOptions(qq.options, qq.correctIndex);
      return { ...qq, options: s.options, correctIndex: s.correctIndex };
    }),
  );
  const [picks, setPicks] = useState<number[]>([]);
  const q = shuffled[index];
  const picked = picks[index];
  const revealed = typeof picked === 'number';

  function choose(i: number) {
    if (revealed) return;
    const copy = [...picks];
    copy[index] = i;
    setPicks(copy);
  }

  function advance() {
    if (index === shuffled.length - 1) {
      const correctIndices = shuffled.map((x) => x.correctIndex);
      const score = scoreQuiz(picks, correctIndices).score;
      const review: ReviewItem[] = shuffled.map((qq, i) => ({
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
        <button type="button" className="kc-btn kc-btn-ghost" onClick={prev} disabled={!canGoBack}>
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
}
