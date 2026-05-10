import { describe, it, expect } from 'vitest';
import { withBase } from './url';

describe('withBase', () => {
  it('prefixes base to absolute-rooted path', () => {
    expect(withBase('/topics', '/kwikacademy/')).toBe('/kwikacademy/topics');
  });
  it('avoids double slashes', () => {
    expect(withBase('/', '/kwikacademy/')).toBe('/kwikacademy/');
  });
  it('handles base without trailing slash', () => {
    expect(withBase('/about', '/kwikacademy')).toBe('/kwikacademy/about');
  });
  it('handles empty path', () => {
    expect(withBase('', '/kwikacademy/')).toBe('/kwikacademy/');
  });
});
