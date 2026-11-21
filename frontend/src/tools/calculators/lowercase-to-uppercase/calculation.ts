import { SHARE_PREVIEW_MAX, type CaseMode } from './types';

/** Unicode-aware uppercase via the ECMAScript String casing algorithm. */
export function convertToUppercase(input: string): string {
  return input.toUpperCase();
}

export function convertToLowercase(input: string): string {
  return input.toLowerCase();
}

/**
 * Simple whitespace title case — not linguistically correct for every language
 * (small words, apostrophes, and locale rules are not special-cased).
 */
export function convertToTitleCase(input: string): string {
  return input.replace(/[^\s]+/gu, (word) => {
    const chars = Array.from(word);
    if (chars.length === 0) return word;
    const [first, ...rest] = chars;
    return first.toUpperCase() + rest.join('').toLowerCase();
  });
}

/** Capitalize the first letter of each sentence-ish segment after . ! ? */
export function convertToSentenceCase(input: string): string {
  const lower = input.toLowerCase();
  let capitalizeNext = true;
  let out = '';
  for (const char of lower) {
    if (capitalizeNext && /\p{L}/u.test(char)) {
      out += char.toUpperCase();
      capitalizeNext = false;
      continue;
    }
    out += char;
    if (/[.!?]/u.test(char)) capitalizeNext = true;
  }
  return out;
}

export function convertToToggleCase(input: string): string {
  let out = '';
  for (const char of input) {
    const upper = char.toUpperCase();
    const lower = char.toLowerCase();
    if (upper !== lower) {
      out += char === lower ? upper : lower;
    } else {
      out += char;
    }
  }
  return out;
}

export function transformCase(input: string, mode: CaseMode): string {
  switch (mode) {
    case 'uppercase':
      return convertToUppercase(input);
    case 'lowercase':
      return convertToLowercase(input);
    case 'title':
      return convertToTitleCase(input);
    case 'sentence':
      return convertToSentenceCase(input);
    case 'toggle':
      return convertToToggleCase(input);
  }
}

/** Unicode code-point count (not UTF-16 code units, not grapheme clusters). */
export function countCharacters(text: string): number {
  return Array.from(text).length;
}

/** Words split on whitespace; empty / whitespace-only → 0. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/u).length;
}

/** Physical lines; empty string → 0. */
export function countLines(text: string): number {
  if (text === '') return 0;
  return text.split(/\r\n|\r|\n/).length;
}

export function textStats(text: string): {
  characters: number;
  words: number;
  lines: number;
} {
  return {
    characters: countCharacters(text),
    words: countWords(text),
    lines: countLines(text),
  };
}

export function shareResultText(input: string, output: string, mode: CaseMode): string {
  const preview =
    output.length > SHARE_PREVIEW_MAX
      ? `${output.slice(0, SHARE_PREVIEW_MAX)}\n… [truncated for share]`
      : output;
  const stats = textStats(input);
  return [
    'Lowercase to Uppercase Converter | Omega Calculators',
    '',
    `Mode: ${mode}`,
    `Characters: ${stats.characters} · Words: ${stats.words} · Lines: ${stats.lines}`,
    '',
    'Result:',
    preview,
    '',
    'Converted client-side with Omega Calculators',
  ].join('\n');
}
