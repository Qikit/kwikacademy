export interface Token {
  text: string;
  kind: 'lat' | 'cyr' | 'num' | 'space' | 'punct' | 'other';
}

/**
 * Demonstration heuristic — NOT a real model tokenizer.
 * Groups runs of the same character class into chunks to show the *principle*:
 * cyrillic (chunk 2) splits finer than latin (chunk 4), so Russian text costs
 * more tokens; digits (chunk 3), code punctuation and emoji fragment too.
 * A real count comes from the vendor's count_tokens.
 */
const CHUNK: Record<string, number> = { lat: 4, cyr: 2, num: 3 };

function classify(ch: string): Token['kind'] {
  if (/\s/.test(ch)) return 'space';
  if (/[а-яёА-ЯЁ]/.test(ch)) return 'cyr';
  if (/[a-zA-Z]/.test(ch)) return 'lat';
  if (/[0-9]/.test(ch)) return 'num';
  if (/[\p{P}\p{S}]/u.test(ch)) return 'punct';
  return 'other';
}

export function tokenize(text: string): Token[] {
  const chars = [...text]; // spread by code point so emoji stay whole
  const tokens: Token[] = [];
  let i = 0;
  while (i < chars.length) {
    const kind = classify(chars[i]);
    const size = CHUNK[kind];
    if (size) {
      let buf = '';
      while (i < chars.length && classify(chars[i]) === kind && buf.length < size) {
        buf += chars[i];
        i++;
      }
      tokens.push({ text: buf, kind });
    } else {
      // space / punct / other — one code point each
      tokens.push({ text: chars[i], kind });
      i++;
    }
  }
  return tokens;
}
