import {
  isValidBinary,
  isValidDecimal,
  isValidHexadecimal,
  stripNoise,
} from './calculation';
import {
  MAX_BINARY_INPUT_LENGTH,
  MAX_DECIMAL_INPUT_LENGTH,
  MAX_HEX_INPUT_LENGTH,
} from './types';

export function parseDecimalInput(raw: string): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') return { value: null, blank: true };
  if (cleaned.length > MAX_DECIMAL_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_DECIMAL_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || !isValidDecimal(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a valid non-negative decimal integer.',
    };
  }
  return { value: cleaned, blank: false };
}

export function parseBinaryInput(raw: string): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') return { value: null, blank: true };
  if (cleaned.length > MAX_BINARY_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_BINARY_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || !isValidBinary(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a valid binary number containing only 0 and 1.',
    };
  }
  return { value: cleaned, blank: false };
}

export function parseHexInput(raw: string): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') return { value: null, blank: true };
  if (cleaned.length > MAX_HEX_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_HEX_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || !isValidHexadecimal(cleaned)) {
    return {
      value: null,
      blank: false,
      error:
        'Enter a valid hexadecimal number containing digits 0–9 and letters A–F.',
    };
  }
  return { value: cleaned, blank: false };
}
