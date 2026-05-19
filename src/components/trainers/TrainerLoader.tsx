import Quiz, { type QuizQuestion } from './Quiz';
import Flashcards, { type Flashcard } from './Flashcards';
import Cloze, { type ClozeItem } from './Cloze';
import Match, { type MatchPair } from './Match';

export type TrainerData =
  | { type: 'quiz'; questions: QuizQuestion[] }
  | { type: 'flashcards'; cards: Flashcard[] }
  | { type: 'cloze'; items: ClozeItem[] }
  | { type: 'match'; pairs: MatchPair[] };

export default function TrainerLoader({ slug, data }: { slug: string; data: TrainerData }) {
  switch (data.type) {
    case 'quiz':
      return <Quiz slug={slug} questions={data.questions} />;
    case 'flashcards':
      return <Flashcards slug={slug} cards={data.cards} />;
    case 'cloze':
      return <Cloze slug={slug} items={data.items} />;
    case 'match':
      return <Match slug={slug} pairs={data.pairs} />;
  }
}
