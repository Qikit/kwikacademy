import { describe, it, expect } from 'vitest';
import { shuffleOptions, shuffleArray } from './shuffle';

describe('shuffleOptions', () => {
  const opts = ['A', 'B', 'C', 'D'];

  it('keeps correctIndex pointing at the same option text', () => {
    const r = shuffleOptions(opts, 1, () => 0);
    expect(r.options[r.correctIndex]).toBe('B');
  });

  it('preserves the full set of options', () => {
    const r = shuffleOptions(opts, 2, () => 0.5);
    expect([...r.options].sort()).toEqual([...opts].sort());
    expect(r.options).toHaveLength(opts.length);
  });

  it('remaps correctly for every starting index', () => {
    for (let ci = 0; ci < opts.length; ci++) {
      const r = shuffleOptions(opts, ci, () => 0);
      expect(r.options[r.correctIndex]).toBe(opts[ci]);
      expect([...r.options].sort()).toEqual([...opts].sort());
    }
  });

  it('does not mutate the input array', () => {
    const input = [...opts];
    shuffleOptions(input, 0, () => 0.3);
    expect(input).toEqual(opts);
  });
});

describe('shuffleArray', () => {
  const arr = ['a', 'b', 'c', 'd', 'e'];

  it('preserves all elements', () => {
    const r = shuffleArray(arr, () => 0.5);
    expect([...r].sort()).toEqual([...arr].sort());
    expect(r).toHaveLength(arr.length);
  });

  it('does not mutate the input', () => {
    const input = [...arr];
    shuffleArray(input, () => 0.3);
    expect(input).toEqual(arr);
  });
});
