import localforage from 'localforage';
import {
  emptyState,
  migrate,
  isLessonDone,
  markLessonDone,
  isTrainerDone,
  recordTrainerResult,
  getTrainerResult,
  getCourseProgress,
  getOverallProgress,
} from './state';
import { LF_KEY, STORAGE_KEY, THEME_KEY, type ProgressState, type ThemeChoice, type TrainerResult } from './types';

// Progress lives in IndexedDB (large quota, future-proof). Theme stays in
// localStorage so it can be read synchronously before first paint (no flash).
// NOTE: IndexedDB is NOT permanent — clearing site data, private mode, and
// Safari's 7-day cap evict it just like localStorage. The real backup is the
// JSON export on /progress; persist() only reduces low-disk auto-eviction.
const lf =
  typeof window !== 'undefined'
    ? localforage.createInstance({ name: 'kwikacademy', storeName: 'progress' })
    : null;

let state: ProgressState = emptyState();

let resolveReady!: () => void;
export const ready = new Promise<void>((r) => {
  resolveReady = r;
});

async function init() {
  try {
    let loaded: unknown = await lf!.getItem(LF_KEY);
    if (!loaded) {
      // one-time migration from the old localStorage key
      try {
        const old = localStorage.getItem(STORAGE_KEY);
        if (old) {
          loaded = JSON.parse(old);
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        /* ignore */
      }
    }
    state = migrate(loaded);
    await lf!.setItem(LF_KEY, state);
    try {
      await navigator.storage?.persist?.();
    } catch {
      /* best-effort */
    }
  } catch {
    state = emptyState();
  } finally {
    resolveReady();
  }
}

if (lf) init();
else resolveReady();

function persist() {
  lf?.setItem(LF_KEY, state).catch(() => {});
}

export function createStore() {
  return {
    ready,
    isLessonDone: (slug: string) => isLessonDone(state, slug),
    markLessonDone(slug: string) {
      markLessonDone(state, slug);
      persist();
    },
    isTrainerDone: (slug: string) => isTrainerDone(state, slug),
    getTrainerResult: (slug: string): TrainerResult | null => getTrainerResult(state, slug),
    recordTrainerResult(result: TrainerResult) {
      recordTrainerResult(state, result);
      persist();
    },
    getCourseProgress: (lessonSlugs: string[]) => getCourseProgress(state, lessonSlugs),
    getOverallProgress: (lessonSlugs: string[], trainerSlugs: string[]) =>
      getOverallProgress(state, lessonSlugs, trainerSlugs),
    setLessonPosition(slug: string, sectionId: string) {
      state.lessonPositions[slug] = sectionId;
      persist();
    },
    snapshot: (): ProgressState => structuredClone(state),
    getTheme(): ThemeChoice | null {
      try {
        return localStorage.getItem(THEME_KEY) as ThemeChoice | null;
      } catch {
        return null;
      }
    },
    setTheme(theme: ThemeChoice) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        /* ignore */
      }
    },
    exportAll: (): string => JSON.stringify(state, null, 2),
    importAll(json: string) {
      state = migrate(JSON.parse(json));
      persist();
    },
    clear() {
      state = emptyState();
      lf?.removeItem(LF_KEY).catch(() => {});
    },
  };
}

export type ProgressStore = ReturnType<typeof createStore>;
