import { useEffect, useState } from 'react';
import TrainerShell, { type TrainerNav } from './TrainerShell';

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export default function Flashcards({
  slug,
  cards,
  nav,
}: {
  slug: string;
  cards: Flashcard[];
  nav?: TrainerNav;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TrainerShell slug={slug} total={cards.length} nav={nav}>
      {({ index, next, prev, canGoBack, finish }) => {
        const c = cards[index];

        useEffect(() => {
          setFlipped(false);
        }, [index]);

        function advance() {
          if (index === cards.length - 1) finish(cards.length);
          else next();
        }

        return (
          <div>
            <button
              onClick={() => setFlipped((f) => !f)}
              style={{
                width: '100%',
                minHeight: 200,
                borderRadius: 'var(--r-lg)',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                color: 'var(--text)',
                padding: 24,
              }}
            >
              {flipped ? c.back : c.front}
            </button>
            {!flipped && c.hint && (
              <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 8 }}>Подсказка: {c.hint}</p>
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
              <button type="button" className="kc-retry" onClick={advance}>
                {index === cards.length - 1 ? 'Завершить' : 'Следующая карта'}
              </button>
            </div>
          </div>
        );
      }}
    </TrainerShell>
  );
}
