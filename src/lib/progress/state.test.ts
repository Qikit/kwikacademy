import { describe, it, expect } from 'vitest';
import {
  emptyState,
  migrate,
  isLessonDone,
  markLessonDone,
  isTrainerDone,
  recordTrainerResult,
  getTrainerResult,
  getOverallProgress,
  getCourseProgress,
} from './state';

describe('progress state', () => {
  it('starts empty without shared references', () => {
    const a = emptyState();
    const b = emptyState();
    markLessonDone(a, 'x');
    expect(isLessonDone(b, 'x')).toBe(false);
  });

  it('marks a lesson done idempotently', () => {
    const s = emptyState();
    markLessonDone(s, 'l1');
    markLessonDone(s, 'l1');
    expect(s.lessonsDone).toEqual(['l1']);
  });

  it('course progress is fraction of done lessons', () => {
    const s = emptyState();
    markLessonDone(s, 'l1');
    expect(getCourseProgress(s, ['l1', 'l2', 'l3', 'l4'])).toBe(25);
  });

  it('overall progress counts lessons and trainers together', () => {
    const s = emptyState();
    markLessonDone(s, 'l1');
    recordTrainerResult(s, { trainerSlug: 't1', score: 0, total: 1, completedAt: 1 });
    recordTrainerResult(s, { trainerSlug: 't2', score: 2, total: 2, completedAt: 2 });
    expect(getOverallProgress(s, ['l1', 'l2'], ['t1', 't2', 't3'])).toBe(60);
  });

  it('keeps only the best trainer result', () => {
    const s = emptyState();
    recordTrainerResult(s, { trainerSlug: 't1', score: 3, total: 5, completedAt: 1 });
    recordTrainerResult(s, { trainerSlug: 't1', score: 5, total: 5, completedAt: 2 });
    recordTrainerResult(s, { trainerSlug: 't1', score: 2, total: 5, completedAt: 3 });
    expect(getTrainerResult(s, 't1')?.score).toBe(5);
  });

  it('marks a finished trainer done regardless of score', () => {
    const s = emptyState();
    recordTrainerResult(s, { trainerSlug: 't1', score: 0, total: 3, completedAt: 1 });
    expect(isTrainerDone(s, 't1')).toBe(true);
    expect(isTrainerDone(s, 't2')).toBe(false);
  });

  it('migrates corrupt or wrong-version data to empty', () => {
    expect(migrate('{not json' as unknown)).toEqual(emptyState());
    expect(migrate({ version: 2, lessonsDone: ['x'] })).toEqual(emptyState());
  });

  it('migrates valid v1 data and drops legacy theme field', () => {
    const out = migrate({ version: 1, lessonsDone: ['a'], theme: 'dark' });
    expect(out.lessonsDone).toEqual(['a']);
    expect('theme' in out).toBe(false);
  });
});
