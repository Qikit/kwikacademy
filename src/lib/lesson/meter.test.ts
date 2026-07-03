import { describe, it, expect } from 'vitest';
import { barPercent } from './meter';

describe('barPercent', () => {
  it('scales value against max to 0-100', () => {
    expect(barPercent(0.5, 1)).toBe(50);
    expect(barPercent(25, 100)).toBe(25);
  });
  it('clamps out-of-range', () => {
    expect(barPercent(2, 1)).toBe(100);
    expect(barPercent(-1, 1)).toBe(0);
  });
  it('guards max<=0', () => {
    expect(barPercent(5, 0)).toBe(0);
  });
});
