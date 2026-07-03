import { describe, it, expect } from 'vitest';
import { bandFor } from './bands';

const bands = [{ upTo: 0.3 }, { upTo: 1.0 }, { upTo: 2.0 }];

describe('bandFor', () => {
  it('picks the first band whose upTo covers value', () => {
    expect(bandFor(0.1, bands)).toBe(0);
    expect(bandFor(0.3, bands)).toBe(0);
    expect(bandFor(0.7, bands)).toBe(1);
    expect(bandFor(2.0, bands)).toBe(2);
  });
  it('clamps above range to last band', () => {
    expect(bandFor(5, bands)).toBe(2);
  });
  it('empty bands → -1', () => {
    expect(bandFor(1, [])).toBe(-1);
  });
});
