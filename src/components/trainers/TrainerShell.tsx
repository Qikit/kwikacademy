import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react';
import { createStore } from '../../lib/progress/store';

export interface TrainerNav {
  backHref: string;
  nextHref?: string;
  courseTrainerSlugs: string[];
}

export interface ReviewItem {
  prompt: ReactNode;
  userAnswer: ReactNode;
  correctAnswer: ReactNode;
  correct: boolean;
  explain?: ReactNode;
}

export interface ShellRenderProps {
  index: number;
  total: number;
  attempt: number;
  next: () => void;
  prev: () => void;
  canGoBack: boolean;
  finish: (score: number, review?: ReviewItem[]) => void;
}

export default function TrainerShell({
  slug,
  total,
  nav,
  children,
}: {
  slug: string;
  total: number;
  nav?: TrainerNav;
  children: (p: ShellRenderProps) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState<null | number>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [courseDone, setCourseDone] = useState(0);
  const [attempt, setAttempt] = useState(0);

  const courseTotal = nav?.courseTrainerSlugs.length ?? 0;

  useEffect(() => {
    if (!nav) return;
    const store = createStore();
    store.ready.then(() =>
      setCourseDone(nav.courseTrainerSlugs.filter((s) => store.isTrainerDone(s)).length),
    );
  }, [nav, finished]);

  function next() {
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  function finish(score: number, reviewItems?: ReviewItem[]) {
    setFinished(score);
    setReview(reviewItems ?? []);
    createStore().recordTrainerResult({ trainerSlug: slug, score, total, completedAt: Date.now() });
  }

  function restart() {
    setIndex(0);
    setFinished(null);
    setReview([]);
    setAttempt((a) => a + 1);
  }

  return (
    <div className="kc-trainer">
      {finished !== null ? (
        <div className="kc-trainer-result">
          <div className="kc-pct-big">{Math.round((finished / total) * 100)}%</div>
          <p>
            {finished} из {total} верно
          </p>
          <div className="kc-result-actions">
            <button onClick={restart} className="kc-btn kc-btn-ghost">
              <RotateCcw size={16} /> Заново
            </button>
            {nav && (
              <a href={nav.backHref} className="kc-btn kc-btn-ghost">
                <ArrowLeft size={16} /> К курсу
              </a>
            )}
            {nav?.nextHref && (
              <a href={nav.nextHref} className="kc-btn kc-btn-primary">
                Следующий тренажёр <ArrowRight size={16} />
              </a>
            )}
          </div>

          {review.length > 0 && (
            <div className="kc-review">
              <h3 className="kc-review-title">Разбор ответов</h3>
              <ol className="kc-review-list">
                {review.map((r, i) => (
                  <li key={i} className={`kc-review-item ${r.correct ? 'is-ok' : 'is-no'}`}>
                    <div className="kc-review-head">
                      <span className="kc-review-num">{i + 1}</span>
                      <span className="kc-review-mark" aria-hidden="true">
                        {r.correct ? <Check size={14} /> : <X size={14} />}
                      </span>
                      <span className="kc-review-status">
                        {r.correct ? 'Верно' : 'Ошибка'}
                      </span>
                    </div>
                    <div className="kc-review-prompt">{r.prompt}</div>
                    <div className="kc-review-row">
                      <span className="kc-review-tag">Твой ответ</span>
                      <span className="kc-review-val">{r.userAnswer}</span>
                    </div>
                    {!r.correct && (
                      <div className="kc-review-row">
                        <span className="kc-review-tag kc-review-tag-ok">Правильно</span>
                        <span className="kc-review-val kc-review-val-ok">{r.correctAnswer}</span>
                      </div>
                    )}
                    {r.explain && <div className="kc-review-explain">{r.explain}</div>}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="kc-trk kc-q-trk" aria-label="Прогресс тренажёра">
            <i style={{ width: `${(index / total) * 100}%` }} />
          </div>
          {courseTotal > 0 && (
            <div className="kc-course-inline">
              Тренажёры курса: {courseDone} / {courseTotal}
            </div>
          )}
          {children({ index, total, attempt, next, prev, canGoBack: index > 0, finish })}
        </>
      )}
    </div>
  );
}
