import { describe, it, expect } from 'vitest';
import { scoreQuiz, scoreCloze, scoreMatch, scoreCategorize, scoreOrdering } from './score';

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

describe('scoreCategorize', () => {
  it('counts correctly placed items', () => {
    const items = [
      { text: 'I drink coffee', category: 'simple' },
      { text: 'I am drinking', category: 'continuous' },
      { text: 'She works here', category: 'simple' },
    ];
    const userAnswers = new Map<string, string>([
      ['I drink coffee', 'simple'],
      ['I am drinking', 'continuous'],
      ['She works here', 'continuous'],
    ]);
    expect(scoreCategorize(items, userAnswers)).toEqual({ score: 2, total: 3 });
  });

  it('treats missing answers as wrong', () => {
    const items = [
      { text: 'a', category: 'x' },
      { text: 'b', category: 'y' },
    ];
    const userAnswers = new Map<string, string>([['a', 'x']]);
    expect(scoreCategorize(items, userAnswers)).toEqual({ score: 1, total: 2 });
  });
});

describe('scoreOrdering', () => {
  it('counts items where the assembled sequence matches exactly', () => {
    const items = [
      { words: ['coffee', 'I', 'drink'], answer: ['I', 'drink', 'coffee'] },
      { words: ['now', 'working', 'am', 'I'], answer: ['I', 'am', 'working', 'now'] },
    ];
    const userAnswers = new Map<number, string[]>([
      [0, ['I', 'drink', 'coffee']],
      [1, ['I', 'am', 'now', 'working']],
    ]);
    expect(scoreOrdering(items, userAnswers)).toEqual({ score: 1, total: 2 });
  });

  it('treats partial assembly as wrong', () => {
    const items = [{ words: ['a', 'b', 'c'], answer: ['a', 'b', 'c'] }];
    const userAnswers = new Map<number, string[]>([[0, ['a', 'b']]]);
    expect(scoreOrdering(items, userAnswers)).toEqual({ score: 0, total: 1 });
  });

  it('matches case- and whitespace-insensitively', () => {
    const items = [{ words: ['A', 'b'], answer: ['A', 'b'] }];
    const userAnswers = new Map<number, string[]>([[0, [' a ', 'B']]]);
    expect(scoreOrdering(items, userAnswers)).toEqual({ score: 1, total: 1 });
  });
});
