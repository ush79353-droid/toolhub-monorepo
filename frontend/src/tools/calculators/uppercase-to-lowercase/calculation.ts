import { SHARE_PREVIEW_MAX } from './types';

/** Unicode-aware lowercase via the ECMAScript String casing algorithm. */
export function convertToLowercase(input: string): string {
  return input.toLowerCase();
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

export function shareResultText(input: string, output: string): string {
  const preview =
    output.length > SHARE_PREVIEW_MAX
      ? `${output.slice(0, SHARE_PREVIEW_MAX)}\n… [truncated for share]`
      : output;
  const stats = textStats(input);
  return [
    'Uppercase to Lowercase Converter — Omega Calculators',
    '',
    `Characters: ${stats.characters} · Words: ${stats.words} · Lines: ${stats.lines}`,
    '',
    'Lowercase result:',
    preview,
    '',
    'Converted client-side with Omega Calculators',
  ].join('\n');
}
