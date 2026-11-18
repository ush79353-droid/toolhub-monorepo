import { parseRgbFields as sharedParseRgbFields } from '@/tools/calculators/rgb-to-hex/validation';
import {
  expandAndConvertHex,
  isSixDigitHex,
  isThreeDigitHex,
  stripHexPrefix,
} from './calculation';
import type { HexRgbFieldErrors, RGB } from './types';

export function parseRgbFields(fields: {
  r: string;
  g: string;
  b: string;
}): { ok: true; rgb: RGB; hex: string } | { ok: false; errors: HexRgbFieldErrors } {
  return sharedParseRgbFields(fields);
}

export function parseHexField(
  raw: string,
  allowShorthand: boolean,
): { ok: true; rgb: RGB; hex: string } | { ok: false; errors: HexRgbFieldErrors } {
  if (!raw.trim()) {
    return {
      ok: false,
      errors: {
        hex: allowShorthand
          ? 'Enter a valid 3-digit or 6-digit hexadecimal color code.'
          : 'Enter a valid 6-digit hexadecimal color code (or enable shorthand).',
      },
    };
  }

  const digits = stripHexPrefix(raw);

  if (!/^[0-9a-fA-F]+$/.test(digits)) {
    return {
      ok: false,
      errors: { hex: 'Enter a valid 3-digit or 6-digit hexadecimal color code.' },
    };
  }

  if (isThreeDigitHex(raw)) {
    if (!allowShorthand) {
      return {
        ok: false,
        errors: {
          hex: 'Enable shorthand HEX notation to use 3-digit codes, or enter a 6-digit code.',
        },
      };
    }
  } else if (!isSixDigitHex(raw)) {
    return {
      ok: false,
      errors: {
        hex: allowShorthand
          ? 'Enter a valid 3-digit or 6-digit hexadecimal color code.'
          : 'Enter a valid 6-digit hexadecimal color code (e.g. FF8300).',
      },
    };
  }

  try {
    return { ok: true, ...expandAndConvertHex(raw) };
  } catch {
    return {
      ok: false,
      errors: { hex: 'Enter a valid 3-digit or 6-digit hexadecimal color code.' },
    };
  }
}
