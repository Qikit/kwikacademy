export type ThemeChoice = 'light' | 'dark';

export interface TrainerResult {
  trainerSlug: string;
  score: number;
  total: number;
  completedAt: number; // epoch ms
}

export interface ProgressState {
  version: 1;
  theme: ThemeChoice | null; // null = follow system
  lessonsDone: string[]; // lesson slugs
  lessonPositions: Record<string, string>; // lessonSlug -> last section id
  trainerResults: Record<string, TrainerResult>; // trainerSlug -> best result
  lastActivity: number;
}

export const EMPTY_STATE: ProgressState = {
  version: 1,
  theme: null,
  lessonsDone: [],
  lessonPositions: {},
  trainerResults: {},
  lastActivity: 0,
};

export const STORAGE_KEY = 'kwik:v1:progress';
