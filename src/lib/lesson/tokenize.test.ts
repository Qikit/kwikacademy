import { describe, it, expect } from 'vitest';
import { tokenize } from './tokenize';

describe('tokenize (demonstration heuristic)', () => {
  it('keeps a short latin word as one token', () => {
    expect(tokenize('cat')).toEqual([{ text: 'cat', kind: 'lat' }]);
  });
  it('splits cyrillic finer than latin — demonstrates higher token cost', () => {
    // cyr chunk = 2 → «привет» (6 симв) → 3 токена
    expect(tokenize('привет').length).toBe(3);
    // lat chunk = 4 → «hello» (5 симв) → 2 токена
    expect(tokenize('hello').length).toBe(2);
  });
  it('treats spaces and punctuation as their own tokens', () => {
    expect(tokenize('a b')).toEqual([
      { text: 'a', kind: 'lat' },
      { text: ' ', kind: 'space' },
      { text: 'b', kind: 'lat' },
    ]);
    expect(tokenize('hi!')).toEqual([
      { text: 'hi', kind: 'lat' },
      { text: '!', kind: 'punct' },
    ]);
  });
  it('chunks digits by 3', () => {
    // «4813» → «481» + «3» = 2 токена
    expect(tokenize('4813').length).toBe(2);
  });
  it('handles empty string', () => {
    expect(tokenize('')).toEqual([]);
  });
});
