import { useState } from 'react';
import TrainerShell from './TrainerShell';
import { scoreQuiz } from '../../lib/trainers/score';

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explain?: string;
}

export default function Quiz({ slug, questions }: { slug: string; questions: QuizQuestion[] }) {
  const [picks, setPicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  return (
    <TrainerShell slug={slug} total={questions.length}>
      {({ index, next, finish }) => {
        const q = questions[index];
        const picked = picks[index];

        function choose(i: number) {
          if (revealed) return;
          const copy = [...picks];
          copy[index] = i;
          setPicks(copy);
          setRevealed(true);
        }

        function advance() {
          setRevealed(false);
          if (index === questions.length - 1) {
            finish(scoreQuiz(picks, questions.map((x) => x.correctIndex)).score);
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
            {revealed && (
              <button className="kc-retry" style={{ marginTop: 16 }} onClick={advance}>
                {index === questions.length - 1 ? 'Завершить' : 'Дальше'}
              </button>
            )}
          </div>
        );
      }}
    </TrainerShell>
  );
}
