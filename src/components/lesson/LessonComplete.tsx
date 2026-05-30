import { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { createStore } from '../../lib/progress/store';

export default function LessonComplete({ slug, nextHref }: { slug: string; nextHref?: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = createStore();
    s.ready.then(() => setDone(s.isLessonDone(slug)));
  }, [slug]);

  function complete() {
    createStore().markLessonDone(slug);
    setDone(true);
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 48, flexWrap: 'wrap' }}>
      <button
        onClick={complete}
        disabled={done}
        style={{
          padding: '12px 22px',
          borderRadius: 9999,
          border: 'none',
          cursor: done ? 'default' : 'pointer',
          fontWeight: 700,
          fontSize: 13,
          color: '#fff',
          background: done ? '#34d399' : 'var(--grad-blue-purple)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {done && <Check size={16} />}
        {done ? 'Урок пройден' : 'Отметить пройденным'}
      </button>
      {nextHref && (
        <a
          href={nextHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--c-purple)',
          }}
        >
          Следующий урок <ArrowRight size={15} />
        </a>
      )}
    </div>
  );
}
