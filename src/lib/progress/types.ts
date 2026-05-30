export type ThemeChoice = 'light' | 'dark';

export interface TrainerResult {
  trainerSlug: string;
  score: number;
  total: number;
  completedAt: number; // epoch ms
}

export interface ProgressState {
  version: 1;
  lessonsDone: string[]; // lesson slugs
  lessonPositions: Record<string, string>; // lessonSlug -> last section id
  trainerResults: Record<string, TrainerResult>; // trainerSlug -> best result
  lastActivity: number;
}

export const EMPTY_STATE: ProgressState = {
  version: 1,
  lessonsDone: [],
  lessonPositions: {},
  trainerResults: {},
  lastActivity: 0,
};

/** Legacy localStorage key (pre-IndexedDB) — read once for migration. */
export const STORAGE_KEY = 'kwik:v1:progress';
/** Theme lives in localStorage for synchronous, flash-free reads. */
export const THEME_KEY = 'kwik:theme';
/** Key inside the localForage instance. */
export const LF_KEY = 'progress';
