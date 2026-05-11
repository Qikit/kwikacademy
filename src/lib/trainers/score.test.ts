import { describe, it, expect } from 'vitest';
import { scoreQuiz, scoreCloze, scoreMatch } from './score';

describe('scoreQuiz', () => {
  it('counts correct picks', () => {
    expect(scoreQuiz([0, 2, 1], [0, 1, 1])).toEqual({ score: 2, total: 3 });
  });
});

describe('scoreCloze', () => {
  it('matches answers case-insensitively and trimmed', () => {
    expect(scoreCloze([['A', 'an']], [[' a ', 'AN']])).toEqual({ score: 1, total: 1 });
  });
  it('partial blanks count toward total', () => {
    expect(scoreCloze([['a', 'b']], [['a', 'x']])).toEqual({ score: 0, total: 1 });
  });
});

describe('scoreMatch', () => {
  it('scores correct pairings', () => {
    const correct = { l1: 'r1', l2: 'r2' };
    expect(scoreMatch(correct, { l1: 'r1', l2: 'r9' })).toEqual({ score: 1, total: 2 });
  });
});
