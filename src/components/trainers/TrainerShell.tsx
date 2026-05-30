import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { createStore } from '../../lib/progress/store';

export interface TrainerNav {
  backHref: string;
  nextHref?: string;
  courseTrainerSlugs: string[];
}

export interface ShellRenderProps {
  index: number;
  total: number;
  next: () => void;
  finish: (score: number) => void;
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
  const [courseDone, setCourseDone] = useState(0);

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

  function finish(score: number) {
    setFinished(score);
    createStore().recordTrainerResult({ trainerSlug: slug, score, total, completedAt: Date.now() });
  }

  function restart() {
    setIndex(0);
    setFinished(null);
  }

  return (
    <div className="kc-trainer">
      {courseTotal > 0 && (
        <div className="kc-course-trk">
          <div className="kc-course-trk-head">
            <span>Тренажёры курса</span>
            <span>
              {courseDone} / {courseTotal}
            </span>
          </div>
          <div className="kc-trk">
            <i style={{ width: `${(courseDone / courseTotal) * 100}%` }} />
          </div>
        </div>
      )}

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
        </div>
      ) : (
        <>
          <div className="kc-trk kc-q-trk">
            <i style={{ width: `${(index / total) * 100}%` }} />
          </div>
          {children({ index, total, next, finish })}
        </>
      )}
    </div>
  );
}
