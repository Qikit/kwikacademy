export interface ScoreResult {
  score: number;
  total: number;
}

const norm = (s: string) => s.trim().toLowerCase();

/** Quiz: each item correct when picked index === correct index. */
export function scoreQuiz(picked: number[], correct: number[]): ScoreResult {
  let score = 0;
  for (let i = 0; i < correct.length; i++) if (picked[i] === correct[i]) score++;
  return { score, total: correct.length };
}

/** Cloze: each item correct only when ALL its blanks match (normalized). */
export function scoreCloze(answers: string[][], picked: string[][]): ScoreResult {
  let score = 0;
  for (let i = 0; i < answers.length; i++) {
    const exp = answers[i];
    const got = picked[i] ?? [];
    const ok = exp.length === got.length && exp.every((a, j) => norm(a) === norm(got[j] ?? ''));
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
