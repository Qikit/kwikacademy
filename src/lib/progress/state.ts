import { EMPTY_STATE, type ProgressState, type TrainerResult } from './types';

/** Fresh empty state — never share EMPTY_STATE's nested objects. */
export function emptyState(): ProgressState {
  return structuredClone(EMPTY_STATE);
}

/** Normalize unknown stored data into a valid current-version state. */
export function migrate(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return emptyState();
  const r = raw as Partial<ProgressState> & { theme?: unknown };
  if (r.version !== 1) return emptyState();
  return {
    version: 1,
    lessonsDone: Array.isArray(r.lessonsDone) ? r.lessonsDone : [],
    lessonPositions: r.lessonPositions ?? {},
    trainerResults: r.trainerResults ?? {},
    lastActivity: typeof r.lastActivity === 'number' ? r.lastActivity : 0,
  };
}

export function isLessonDone(s: ProgressState, slug: string): boolean {
  return s.lessonsDone.includes(slug);
}

export function markLessonDone(s: ProgressState, slug: string): void {
  if (!s.lessonsDone.includes(slug)) s.lessonsDone.push(slug);
  s.lastActivity = Date.now();
}

export function isTrainerDone(s: ProgressState, slug: string): boolean {
  return slug in s.trainerResults;
}

export function getTrainerResult(s: ProgressState, slug: string): TrainerResult | null {
  return s.trainerResults[slug] ?? null;
}

/** Keep only the best (highest score) result per trainer. */
export function recordTrainerResult(s: ProgressState, result: TrainerResult): void {
  const prev = s.trainerResults[result.trainerSlug];
  if (!prev || result.score > prev.score) s.trainerResults[result.trainerSlug] = result;
  s.lastActivity = Date.now();
}

export function getCourseProgress(s: ProgressState, lessonSlugs: string[]): number {
  if (lessonSlugs.length === 0) return 0;
  const done = lessonSlugs.filter((x) => s.lessonsDone.includes(x)).length;
  return Math.round((done / lessonSlugs.length) * 100);
}

/** Combined progress over a course's lessons and trainers. */
export function getOverallProgress(
  s: ProgressState,
  lessonSlugs: string[],
  trainerSlugs: string[],
): number {
  const total = lessonSlugs.length + trainerSlugs.length;
  if (total === 0) return 0;
  const doneLessons = lessonSlugs.filter((x) => s.lessonsDone.includes(x)).length;
  const doneTrainers = trainerSlugs.filter((x) => x in s.trainerResults).length;
  return Math.round(((doneLessons + doneTrainers) / total) * 100);
}
