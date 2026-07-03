/** Index of the first band whose upTo >= value; last band if none; -1 if empty. */
export function bandFor(value: number, bands: { upTo: number }[]): number {
  if (bands.length === 0) return -1;
  const i = bands.findIndex((b) => value <= b.upTo);
  return i === -1 ? bands.length - 1 : i;
}
