import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from './store';

beforeEach(() => localStorage.clear());

describe('progressStore', () => {
  it('starts empty', () => {
    const s = createStore();
    expect(s.getCourseProgress(['a', 'b'])).toBe(0);
  });

  it('marks a lesson done and persists', () => {
    const s = createStore();
    s.markLessonDone('intro');
    const s2 = createStore();
    expect(s2.isLessonDone('intro')).toBe(true);
  });

  it('computes course progress as fraction of done lessons', () => {
    const s = createStore();
    s.markLessonDone('l1');
    expect(s.getCourseProgress(['l1', 'l2', 'l3', 'l4'])).toBe(25);
  });

  it('records best trainer result only', () => {
    const s = createStore();
    s.recordTrainerResult({ trainerSlug: 't1', score: 3, total: 5, completedAt: 1 });
    s.recordTrainerResult({ trainerSlug: 't1', score: 5, total: 5, completedAt: 2 });
    s.recordTrainerResult({ trainerSlug: 't1', score: 2, total: 5, completedAt: 3 });
    expect(s.getTrainerResult('t1')?.score).toBe(5);
  });

  it('round-trips export/import', () => {
    const s = createStore();
    s.markLessonDone('x');
    const json = s.exportAll();
    localStorage.clear();
    const s2 = createStore();
    s2.importAll(json);
    expect(s2.isLessonDone('x')).toBe(true);
  });

  it('falls back to empty state on corrupt storage', () => {
    localStorage.setItem('kwik:v1:progress', '{not json');
    const s = createStore();
    expect(s.isLessonDone('anything')).toBe(false);
  });

  it('stores and reads theme', () => {
    const s = createStore();
    s.setTheme('dark');
    expect(createStore().getTheme()).toBe('dark');
  });
});
