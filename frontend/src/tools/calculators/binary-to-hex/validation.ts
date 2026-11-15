import {
  isValidBinary,
  isValidHex,
  stripBinaryNoise,
  stripHexNoise,
} from './calculation';
import { MAX_BINARY_INPUT_LENGTH, MAX_HEX_INPUT_LENGTH } from './types';

export function parseBinaryInput(raw: string): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripBinaryNoise(raw);
  if (cleaned === '') {
    return { value: null, blank: true };
  }
  if (cleaned.length > MAX_BINARY_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Binary input is limited to ${MAX_BINARY_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || /[^01]/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Please enter a valid binary number containing only 0 and 1.',
    };
  }
  if (!isValidBinary(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Please enter a valid binary number containing only 0 and 1.',
    };
  }
  return { value: cleaned, blank: false };
}

export function parseHexInput(raw: string): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripHexNoise(raw);
  if (cleaned === '') {
    return { value: null, blank: true };
  }
  if (cleaned.length > MAX_HEX_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Hexadecimal input is limited to ${MAX_HEX_INPUT_LENGTH} digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || /[^0-9A-Fa-f]/.test(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Please enter a valid hexadecimal number (0–9, A–F).',
    };
  }
  if (!isValidHex(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Please enter a valid hexadecimal number (0–9, A–F).',
    };
  }
  return { value: cleaned.toUpperCase(), blank: false };
}
