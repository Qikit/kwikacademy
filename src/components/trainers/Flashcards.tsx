import { useState } from 'react';
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
  return (
    <TrainerShell slug={slug} total={cards.length} nav={nav}>
      {({ index, next, prev, canGoBack, finish }) => {
        const isLast = index === cards.length - 1;
        const advance = () => (isLast ? finish(cards.length) : next());
        return (
          <Card
            key={index}
            card={cards[index]}
            isLast={isLast}
            canGoBack={canGoBack}
            onPrev={prev}
            onAdvance={advance}
          />
        );
      }}
    </TrainerShell>
  );
}

function Card({
  card,
  isLast,
  canGoBack,
  onPrev,
  onAdvance,
}: {
  card: Flashcard;
  isLast: boolean;
  canGoBack: boolean;
  onPrev: () => void;
  onAdvance: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
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
        {flipped ? card.back : card.front}
      </button>
      {!flipped && card.hint && (
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 8 }}>Подсказка: {card.hint}</p>
      )}
      <div className="kc-nav-row">
        <button type="button" className="kc-btn kc-btn-ghost" onClick={onPrev} disabled={!canGoBack}>
          Назад
        </button>
        <button type="button" className="kc-retry" onClick={onAdvance}>
          {isLast ? 'Завершить' : 'Следующая карта'}
        </button>
      </div>
    </div>
  );
}
