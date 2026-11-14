import { GREEK_LETTER_NAMES, GREEK_LETTER_VALUES } from './mappings';
import type { GreekGematriaLetter, GreekGematriaResult } from './types';

export { GREEK_LETTER_VALUES, GREEK_LETTER_NAMES };
export { GREEK_ISOPSEPHY_DISPLAY_TABLE, GREEK_ISOPSEPHY_TABLE } from './mappings';

/** Combining marks commonly used with Greek (accents, breathings, iota subscript). */
const COMBINING_MARK = /[\u0300-\u036F\u0342\u0345]/gu;

/**
 * Normalize Greek text for lookup:
 * NFC → NFD → strip combining diacritics → NFC.
 * Does not map Latin lookalikes to Greek.
 */
export function normalizeGreekText(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARK, '')
    .normalize('NFC');
}

export function getGreekLetterValue(letter: string): number | null {
  if (letter.length === 0) return null;
  const key = normalizeGreekText(letter);
  const value = GREEK_LETTER_VALUES[key];
  return value === undefined ? null : value;
}

export function getGreekLetterName(letter: string): string {
  const key = normalizeGreekText(letter);
  return GREEK_LETTER_NAMES[key] ?? 'Unknown';
}

function isIgnoredWithoutNotice(char: string): boolean {
  return (
    /\s/u.test(char) ||
    COMBINING_MARK.test(char) ||
    /[\d\p{P}\p{S}]/u.test(char)
  );
}

export function calculateGreekGematria(text: string): GreekGematriaResult {
  const originalText = text;
  const breakdown: GreekGematriaLetter[] = [];
  const ignored: string[] = [];
  let total = 0;
  let letterCount = 0;
  const normalizedLetters: string[] = [];

  for (const original of text.normalize('NFC')) {
    if (COMBINING_MARK.test(original)) {
      continue;
    }
    if (/\s/u.test(original)) {
      continue;
    }
    if (/[\d\p{P}\p{S}]/u.test(original) && getGreekLetterValue(original) === null) {
      continue;
    }

    const normalizedCharacter = normalizeGreekText(original);
    const value = getGreekLetterValue(normalizedCharacter);

    if (value === null) {
      if (!isIgnoredWithoutNotice(original)) {
        ignored.push(original);
      }
      continue;
    }

    if (!Number.isSafeInteger(total + value)) {
      throw new RangeError('Result exceeds the safe integer range for this calculator.');
    }

    total += value;
    letterCount += 1;
    normalizedLetters.push(normalizedCharacter);
    breakdown.push({
      originalCharacter: original,
      normalizedCharacter,
      greekLetterName: getGreekLetterName(normalizedCharacter),
      value,
      counted: true,
    });
  }

  const additionFormula =
    breakdown.length === 0
      ? ''
      : `${breakdown.map((row) => String(row.value)).join(' + ')} = ${total}`;

  return {
    originalText,
    normalizedText: normalizedLetters.join(''),
    total,
    letterCount,
    breakdown,
    ignoredCharacters: [...new Set(ignored)],
    additionFormula,
  };
}

export function formatGreekGematriaBreakdown(result: GreekGematriaResult): string {
  if (result.letterCount === 0) return '';
  const parts = result.breakdown.map(
    (row) => `${row.originalCharacter}(${row.value})`
  );
  return `${parts.join(' + ')} = ${result.total}`;
}
