export interface ScoreResult {
  score: number;
  total: number;
}

const norm = (s: string, caseSensitive = false) => {
  const text = s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return caseSensitive ? text : text.toLowerCase();
};

/** Quiz: each item correct when picked index === correct index. */
export function scoreQuiz(picked: number[], correct: number[]): ScoreResult {
  let score = 0;
  for (let i = 0; i < correct.length; i++) if (picked[i] === correct[i]) score++;
  return { score, total: correct.length };
}

/** A blank accepts a single string or any of several variants (all normalized). */
export const matchesBlank = (expected: string | string[], got: string, caseSensitive = false): boolean =>
  Array.isArray(expected)
    ? expected.some((a) => norm(a, caseSensitive) === norm(got, caseSensitive))
    : norm(expected, caseSensitive) === norm(got, caseSensitive);

/** Cloze: each item correct only when EVERY blank matches one of its accepted variants. */
export function scoreCloze(
  answers: (string | string[])[][],
  picked: string[][],
  caseSensitive = false,
): ScoreResult {
  let score = 0;
  for (let i = 0; i < answers.length; i++) {
    const exp = answers[i];
    const got = picked[i] ?? [];
    const ok = exp.length === got.length && exp.every((a, j) => matchesBlank(a, got[j] ?? '', caseSensitive));
    if (ok) score++;
  }
  return { score, total: answers.length };
}

/** Match: score per left key whose chosen right value equals the correct one. */
export function scoreMatch(
  correct: Record<string, string>,
  picked: Record<string, string>,
): ScoreResult {
  const keys = Object.keys(correct);
  let score = 0;
  for (const k of keys) if (picked[k] === correct[k]) score++;
  return { score, total: keys.length };
}

export interface CategorizeItem {
  text: string;
  category: string;
}

/** Categorize: each item correct when userAnswer matches expected category. */
export function scoreCategorize(
  items: CategorizeItem[],
  userAnswers: Map<string, string>,
): ScoreResult {
  let score = 0;
  for (const item of items) {
    if (userAnswers.get(item.text) === item.category) score++;
  }
  return { score, total: items.length };
}

export interface OrderingItem {
  words: string[];
  answer: string[];
}

/** Ordering: each item correct when assembled sequence matches answer (normalized). */
export function scoreOrdering(
  items: OrderingItem[],
  userAnswers: Map<number, string[]>,
  exact = false,
): ScoreResult {
  let score = 0;
  for (let i = 0; i < items.length; i++) {
    const exp = items[i].answer;
    const got = userAnswers.get(i) ?? [];
    const same = (w: string, g: string) => (exact ? w === g : norm(w) === norm(g));
    const ok = exp.length === got.length && exp.every((w, j) => same(w, got[j] ?? ''));
    if (ok) score++;
  }
  return { score, total: items.length };
}
