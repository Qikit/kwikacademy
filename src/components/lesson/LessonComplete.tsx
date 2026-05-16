import { useEffect, useState } from 'react';
import { createStore } from '../../lib/progress/store';

export default function LessonComplete({ slug, nextHref }: { slug: string; nextHref?: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(createStore().isLessonDone(slug));
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
        }}
      >
        {done ? '✓ Урок пройден' : 'Отметить пройденным'}
      </button>
      {nextHref && (
        <a href={nextHref} style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-purple)' }}>
          Следующий урок →
        </a>
      )}
    </div>
  );
}
