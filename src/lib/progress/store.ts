import {
  EMPTY_STATE,
  STORAGE_KEY,
  type ProgressState,
  type ThemeChoice,
  type TrainerResult,
} from './types';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/** Fresh empty state — never share EMPTY_STATE's nested objects across stores. */
function emptyState(): ProgressState {
  return structuredClone(EMPTY_STATE);
}

function migrate(raw: unknown): ProgressState {
  // version 1 is current; future versions branch here before returning.
  if (!raw || typeof raw !== 'object') return emptyState();
  const r = raw as Partial<ProgressState>;
  if (r.version !== 1) return emptyState();
  return {
    ...emptyState(),
    ...r,
    lessonsDone: Array.isArray(r.lessonsDone) ? r.lessonsDone : [],
    lessonPositions: r.lessonPositions ?? {},
    trainerResults: r.trainerResults ?? {},
  };
}

function read(): ProgressState {
  if (!isBrowser()) return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function createStore() {
  let state = read();

  function persist() {
    state.lastActivity = Date.now();
    if (isBrowser()) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  return {
    isLessonDone: (slug: string) => state.lessonsDone.includes(slug),
    markLessonDone(slug: string) {
      if (!state.lessonsDone.includes(slug)) state.lessonsDone.push(slug);
      persist();
    },
    getCourseProgress(lessonSlugs: string[]): number {
      if (lessonSlugs.length === 0) return 0;
      const done = lessonSlugs.filter((s) => state.lessonsDone.includes(s)).length;
      return Math.round((done / lessonSlugs.length) * 100);
    },
    recordTrainerResult(result: TrainerResult) {
      const prev = state.trainerResults[result.trainerSlug];
      if (!prev || result.score > prev.score) state.trainerResults[result.trainerSlug] = result;
      persist();
    },
    getTrainerResult: (slug: string): TrainerResult | null => state.trainerResults[slug] ?? null,
    isTrainerDone: (slug: string) => slug in state.trainerResults,
    getOverallProgress(lessonSlugs: string[], trainerSlugs: string[]): number {
      const total = lessonSlugs.length + trainerSlugs.length;
      if (total === 0) return 0;
      const doneLessons = lessonSlugs.filter((s) => state.lessonsDone.includes(s)).length;
      const doneTrainers = trainerSlugs.filter((s) => s in state.trainerResults).length;
      return Math.round(((doneLessons + doneTrainers) / total) * 100);
    },
    getTheme: (): ThemeChoice | null => state.theme,
    setTheme(theme: ThemeChoice) {
      state.theme = theme;
      persist();
    },
    setLessonPosition(slug: string, sectionId: string) {
      state.lessonPositions[slug] = sectionId;
      persist();
    },
    snapshot: (): ProgressState => structuredClone(state),
    exportAll: (): string => JSON.stringify(state, null, 2),
    importAll(json: string) {
      state = migrate(JSON.parse(json));
      persist();
    },
  };
}

export type ProgressStore = ReturnType<typeof createStore>;
