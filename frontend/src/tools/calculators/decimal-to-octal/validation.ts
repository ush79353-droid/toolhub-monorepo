import {
  isValidDecimalInteger,
  isValidOctalInteger,
  normalizeNumericInput,
} from './calculation';
import { MAX_INPUT_LENGTH, type ConversionDirection } from './types';

export function parseDecimalOctalInput(
  raw: string,
  direction: ConversionDirection
): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = normalizeNumericInput(raw);
  if (cleaned === '') return { value: null, blank: true };
  if (cleaned.length > MAX_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: 'This number exceeds the supported input length.',
    };
  }

  if (direction === 'decimal-to-octal') {
    if (/[.\-]/.test(cleaned) || /[eE]/.test(cleaned) || !isValidDecimalInteger(cleaned)) {
      return {
        value: null,
        blank: false,
        error: 'Please enter a valid non-negative whole number.',
      };
    }
    return { value: cleaned, blank: false };
  }

  if (/[.\-]/.test(cleaned) || !isValidOctalInteger(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a valid octal number using digits from 0 to 7 only.',
    };
  }
  return { value: cleaned, blank: false };
}
