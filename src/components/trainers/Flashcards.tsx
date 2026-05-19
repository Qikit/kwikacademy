import { useState } from 'react';
import TrainerShell from './TrainerShell';

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export default function Flashcards({ slug, cards }: { slug: string; cards: Flashcard[] }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TrainerShell slug={slug} total={cards.length}>
      {({ index, next, finish }) => {
        const c = cards[index];

        function advance() {
          setFlipped(false);
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
            <button className="kc-retry" style={{ marginTop: 16 }} onClick={advance}>
              {index === cards.length - 1 ? 'Завершить' : 'Следующая карта'}
            </button>
          </div>
        );
      }}
    </TrainerShell>
  );
}
