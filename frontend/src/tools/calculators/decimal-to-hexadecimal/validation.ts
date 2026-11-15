import { isValidDecimal, isValidHexadecimal, stripNoise } from './calculation';
import {
  INT16_MAX,
  INT16_MIN,
  MAX_DECIMAL_INPUT_LENGTH,
  MAX_HEX_INPUT_LENGTH,
  type ConversionDirection,
  type HexRepresentation,
} from './types';

export function parseDecimalHexInput(
  raw: string,
  direction: ConversionDirection,
  representation: HexRepresentation
): {
  value: string | null;
  blank: boolean;
  error?: string;
} {
  const cleaned = stripNoise(raw);
  if (cleaned === '') return { value: null, blank: true };

  if (direction === 'decimal-to-hex') {
    if (cleaned.length > MAX_DECIMAL_INPUT_LENGTH) {
      return {
        value: null,
        blank: false,
        error: `Input is limited to ${MAX_DECIMAL_INPUT_LENGTH} characters.`,
      };
    }
    if (/[.]/.test(cleaned) || !isValidDecimal(cleaned)) {
      return {
        value: null,
        blank: false,
        error: 'Enter a valid integer between -32768 and 32767.',
      };
    }
    try {
      const n = BigInt(cleaned);
      if (n < BigInt(INT16_MIN) || n > BigInt(INT16_MAX)) {
        return {
          value: null,
          blank: false,
          error: 'Enter a valid integer between -32768 and 32767.',
        };
      }
    } catch {
      return {
        value: null,
        blank: false,
        error: 'Enter a valid integer between -32768 and 32767.',
      };
    }
    return { value: cleaned, blank: false };
  }

  if (cleaned.length > MAX_HEX_INPUT_LENGTH) {
    return {
      value: null,
      blank: false,
      error: `Input is limited to ${MAX_HEX_INPUT_LENGTH} hexadecimal digits.`,
    };
  }
  if (/[.\-]/.test(cleaned) || !isValidHexadecimal(cleaned)) {
    return {
      value: null,
      blank: false,
      error: 'Enter a valid hexadecimal number using digits 0–9 and letters A–F.',
    };
  }
  const upper = cleaned.toUpperCase();
  const withoutLeading = upper.replace(/^0+/, '') || '0';
  if (representation === 'signed-16' && withoutLeading.length > 4) {
    return {
      value: null,
      blank: false,
      error: 'Signed 16-bit hexadecimal values use at most 4 digits.',
    };
  }
  return { value: cleaned, blank: false };
}
