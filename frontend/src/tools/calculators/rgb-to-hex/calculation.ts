import { rgbToHex as colorRgbToHex } from '@/tools/calculators/color/calculation';
import type { RGB } from './types';

/** Reuse Color Converter’s uppercase #RRGGBB formatter. */
export function rgbToHex(red: number, green: number, blue: number): string {
  if (
    ![red, green, blue].every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 255,
    )
  ) {
    throw new RangeError('RGB values must be integers between 0 and 255.');
  }
  return colorRgbToHex(red, green, blue);
}

/**
 * HEX → RGB for standard 3-digit / 6-digit codes only (no alpha lengths).
 * Reuses the same channel parsing rules as the Color Converter.
 */
export function hexToRgb(hex: string): RGB {
  let normalized = hex.trim().replace(/^#/, '');

  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    normalized = normalized
      .split('')
      .map((character) => character + character)
      .join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    throw new Error('Enter a valid 3-digit or 6-digit HEX color code.');
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function tryHexToRgb(hex: string): RGB | null {
  try {
    return hexToRgb(hex);
  } catch {
    return null;
  }
}

export function tryRgbToHex(r: number, g: number, b: number): string | null {
  try {
    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

export function formatRgbCss(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
