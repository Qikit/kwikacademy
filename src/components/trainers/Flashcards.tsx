import { useState } from 'react';
import TrainerShell, { type ReviewItem, type ShellRenderProps, type TrainerNav } from './TrainerShell';

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
      {(shell) => <FlashcardsBody key={shell.attempt} cards={cards} shell={shell} />}
    </TrainerShell>
  );
}

function FlashcardsBody({ cards, shell }: { cards: Flashcard[]; shell: ShellRenderProps }) {
  const { index, next, prev, canGoBack, finish } = shell;
  const [recalled, setRecalled] = useState<boolean[]>([]);
  const isLast = index === cards.length - 1;

  function rate(value: boolean) {
    const marks = [...recalled];
    marks[index] = value;
    setRecalled(marks);
    if (!isLast) {
      next();
      return;
    }
    const review: ReviewItem[] = cards.map((card, i) => ({
      prompt: card.front,
      userAnswer: marks[i] ? 'Вспомнил' : 'Не вспомнил',
      correctAnswer: card.back,
      correct: marks[i] === true,
    }));
    finish(marks.filter(Boolean).length, review);
  }

  return <Card key={index} card={cards[index]} canGoBack={canGoBack} onPrev={prev} onRate={rate} />;
}

function Card({
  card,
  canGoBack,
  onPrev,
  onRate,
}: {
  card: Flashcard;
  canGoBack: boolean;
  onPrev: () => void;
  onRate: (recalled: boolean) => void;
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
          overflowWrap: 'break-word',
          hyphens: 'auto',
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
        {flipped ? (
          <div className="kc-rate">
            <button type="button" className="kc-btn kc-btn-ghost" onClick={() => onRate(false)}>
              Не вспомнил
            </button>
            <button type="button" className="kc-retry" onClick={() => onRate(true)}>
              Вспомнил
            </button>
          </div>
        ) : (
          <button type="button" className="kc-retry" onClick={() => setFlipped(true)}>
            Показать ответ
          </button>
        )}
      </div>
    </div>
  );
}
