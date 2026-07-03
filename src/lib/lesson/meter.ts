/** Percentage (0–100) of value against max, clamped. */
export function barPercent(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}
