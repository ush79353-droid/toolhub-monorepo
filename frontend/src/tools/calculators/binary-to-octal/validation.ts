import { isValidBinary, isValidOctal, stripNoise } from './calculation';
import type { ConversionDirection } from './types';
import { MAX_BINARY_OCTAL_INPUT_LENGTH } from './types';

export function parseBinaryOctalInput(
  raw: string,
  direction: ConversionDirection
): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') {
    return { value: null, blank: true };
  }
  if (cleaned.length > MAX_BINARY_OCTAL_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_BINARY_OCTAL_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error:
        direction === 'binary-to-octal'
          ? 'Please enter a valid binary number containing only 0 and 1.'
          : 'Please enter a valid octal number containing digits from 0 to 7.',
    };
  }

  if (direction === 'binary-to-octal') {
    if (!isValidBinary(cleaned)) {
      return {
        value: null,
        blank: false,
        error: 'Please enter a valid binary number containing only 0 and 1.',
      };
    }
    return { value: cleaned, blank: false };
  }

  if (!isValidOctal(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Please enter a valid octal number containing digits from 0 to 7.',
    };
  }
  return { value: cleaned, blank: false };
}
