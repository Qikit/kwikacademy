import Quiz, { type QuizQuestion } from './Quiz';
import Flashcards, { type Flashcard } from './Flashcards';
import Cloze, { type ClozeItem } from './Cloze';
import Match, { type MatchPair } from './Match';
import Categorize, { type CategorizeCategory, type CategorizeItem } from './Categorize';
import Ordering, { type OrderingItem } from './Ordering';
import { type TrainerNav } from './TrainerShell';

export type TrainerData =
  | { type: 'quiz'; questions: QuizQuestion[] }
  | { type: 'flashcards'; cards: Flashcard[] }
  | { type: 'cloze'; items: ClozeItem[] }
  | { type: 'match'; pairs: MatchPair[] }
  | { type: 'categorize'; categories: CategorizeCategory[]; items: CategorizeItem[] }
  | { type: 'ordering'; items: OrderingItem[] };

export default function TrainerLoader({
  slug,
  data,
  nav,
}: {
  slug: string;
  data: TrainerData;
  nav?: TrainerNav;
}) {
  switch (data.type) {
    case 'quiz':
      return <Quiz slug={slug} questions={data.questions} nav={nav} />;
    case 'flashcards':
      return <Flashcards slug={slug} cards={data.cards} nav={nav} />;
    case 'cloze':
      return <Cloze slug={slug} items={data.items} nav={nav} />;
    case 'match':
      return <Match slug={slug} pairs={data.pairs} nav={nav} />;
    case 'categorize':
      return (
        <Categorize
          slug={slug}
          categories={data.categories}
          items={data.items}
          nav={nav}
        />
      );
    case 'ordering':
      return <Ordering slug={slug} items={data.items} nav={nav} />;
  }
}
