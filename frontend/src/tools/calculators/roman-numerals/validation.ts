import {
  isValidArabicNumber,
  isValidRomanNumeral,
  normalizeRomanNumeral,
  stripNoise,
} from './calculation';
import { MAX_INPUT_LENGTH, type ConversionDirection } from './types';

export function parseRomanInput(
  raw: string,
  direction: ConversionDirection
): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') return { value: null, blank: true };
  if (cleaned.length > MAX_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_INPUT_LENGTH} characters.`,
    };
  }

  if (direction === 'arabic-to-roman') {
    if (/[.\-]/.test(cleaned) || !isValidArabicNumber(cleaned)) {
      return {
        value: null,
        blank: false,
        error: 'Enter a whole number between 1 and 3999.',
      };
    }
    return { value: cleaned, blank: false };
  }

  const roman = normalizeRomanNumeral(cleaned);
  if (!isValidRomanNumeral(roman)) {
    return {
      value: null,
      blank: false,
      error:
        'Please enter a valid Roman numeral using I, V, X, L, C, D, and M.',
    };
  }
  return { value: roman, blank: false };
}
