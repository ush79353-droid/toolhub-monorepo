import type { UnicodeConversionResult } from './types';

/** Map a character through a table; preserve unsupported chars. */
function mapChars(input: string, map: (ch: string) => string | undefined): string {
  let out = '';
  for (const ch of input) {
    out += map(ch) ?? ch;
  }
  return out;
}

function rangeMap(
  ch: string,
  from: string,
  to: string,
  baseCodePoint: number,
): string | undefined {
  if (ch.length !== 1 && [...ch].length !== 1) return undefined;
  const code = ch.codePointAt(0);
  if (code === undefined) return undefined;
  const fromCode = from.codePointAt(0)!;
  const toCode = to.codePointAt(0)!;
  if (code < fromCode || code > toCode) return undefined;
  return String.fromCodePoint(baseCodePoint + (code - fromCode));
}

/** Circled: a–z → ⓐ–ⓩ, A–Z → Ⓐ–Ⓩ, 0 → ⓪, 1–9 → ①–⑨ */
export function toCircled(input: string): string {
  return mapChars(input, (ch) => {
    const lower = rangeMap(ch, 'a', 'z', 0x24d0);
    if (lower) return lower;
    const upper = rangeMap(ch, 'A', 'Z', 0x24b6);
    if (upper) return upper;
    if (ch === '0') return '\u24EA';
    const digit = rangeMap(ch, '1', '9', 0x2460);
    return digit;
  });
}

/**
 * Negative circled Latin capitals U+1F150–U+1F169 (🅐–🅩).
 * Lowercase maps to the same capital forms (Unicode has no separate case).
 */
export function toNegativeCircled(input: string): string {
  return mapChars(input, (ch) => {
    const upper = ch.toUpperCase();
    return rangeMap(upper, 'A', 'Z', 0x1f150);
  });
}

/** Squared Latin capitals U+1F130–U+1F149 (🄰–🅉). */
export function toSquared(input: string): string {
  return mapChars(input, (ch) => {
    const upper = ch.toUpperCase();
    return rangeMap(upper, 'A', 'Z', 0x1f130);
  });
}

/** Negative squared Latin capitals U+1F170–U+1F189 (🅰–🆉). */
export function toNegativeSquared(input: string): string {
  return mapChars(input, (ch) => {
    const upper = ch.toUpperCase();
    return rangeMap(upper, 'A', 'Z', 0x1f170);
  });
}

/** Upside-down / inverted substitutions (approximate glyphs). */
const INVERT_MAP: Readonly<Record<string, string>> = {
  a: 'ɐ',
  b: 'q',
  c: 'ɔ',
  d: 'p',
  e: 'ǝ',
  f: 'ɟ',
  g: 'ƃ',
  h: 'ɥ',
  i: 'ᴉ',
  j: 'ɾ',
  k: 'ʞ',
  l: 'l',
  m: 'ɯ',
  n: 'u',
  o: 'o',
  p: 'd',
  q: 'b',
  r: 'ɹ',
  s: 's',
  t: 'ʇ',
  u: 'n',
  v: 'ʌ',
  w: 'ʍ',
  x: 'x',
  y: 'ʎ',
  z: 'z',
  A: '∀',
  B: '𐐒',
  C: 'Ɔ',
  D: 'ᗡ',
  E: 'Ǝ',
  F: 'Ⅎ',
  G: 'פ',
  H: 'H',
  I: 'I',
  J: 'ſ',
  K: 'ʞ',
  L: '˥',
  M: 'W',
  N: 'N',
  O: 'O',
  P: 'Ԁ',
  Q: 'Q',
  R: 'ᴚ',
  S: 'S',
  T: '┴',
  U: '∩',
  V: 'Λ',
  W: 'M',
  X: 'X',
  Y: '⅄',
  Z: 'Z',
  '0': '0',
  '1': 'Ɩ',
  '2': 'ᄅ',
  '3': 'Ɛ',
  '4': 'ㄣ',
  '5': 'ϛ',
  '6': '9',
  '7': 'ㄥ',
  '8': '8',
  '9': '6',
  '.': '˙',
  ',': "'",
  "'": ',',
  '"': '„',
  '!': '¡',
  '?': '¿',
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '<': '>',
  '>': '<',
  '&': '⅋',
  _: '‾',
};

export function toInverted(input: string): string {
  return mapChars(input, (ch) => INVERT_MAP[ch]);
}

/** Reverse by grapheme cluster when Intl.Segmenter is available. */
export function reverseGraphemes(input: string): string {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(input), (part) => part.segment).reverse().join('');
  }
  // Fallback: iterate code points (safer than UTF-16 units; not full grapheme-aware).
  return Array.from(input).reverse().join('');
}

export function toInvertedReversed(input: string): string {
  return reverseGraphemes(toInverted(input));
}

/**
 * Mathematical monospace: A–Z U+1D670–, a–z U+1D68A–, 0–9 U+1D7F6–.
 * Uses fromCodePoint for supplementary-plane safety.
 */
export function toMonospaced(input: string): string {
  return mapChars(input, (ch) => {
    const upper = rangeMap(ch, 'A', 'Z', 0x1d670);
    if (upper) return upper;
    const lower = rangeMap(ch, 'a', 'z', 0x1d68a);
    if (lower) return lower;
    return rangeMap(ch, '0', '9', 0x1d7f6);
  });
}

export function convertUnicodeText(input: string): UnicodeConversionResult {
  return {
    circled: toCircled(input),
    negativeCircled: toNegativeCircled(input),
    squared: toSquared(input),
    negativeSquared: toNegativeSquared(input),
    inverted: toInverted(input),
    invertedReversed: toInvertedReversed(input),
    monospaced: toMonospaced(input),
  };
}
