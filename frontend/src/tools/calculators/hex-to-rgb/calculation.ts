/** Reuse the shared RGB↔HEX engine — no second conversion implementation. */
export {
  formatRgbCss,
  hexToRgb,
  rgbToHex,
  tryHexToRgb,
  tryRgbToHex,
} from '@/tools/calculators/rgb-to-hex/calculation';

import type { RGB } from './types';
import { hexToRgb, rgbToHex } from '@/tools/calculators/rgb-to-hex/calculation';

export function formatRgbTuple(rgb: RGB): string {
  return `(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/** Normalize raw HEX digits (no #) for length checks. */
export function stripHexPrefix(raw: string): string {
  return raw.trim().replace(/^#/, '');
}

export function isThreeDigitHex(raw: string): boolean {
  return /^[0-9a-fA-F]{3}$/.test(stripHexPrefix(raw));
}

export function isSixDigitHex(raw: string): boolean {
  return /^[0-9a-fA-F]{6}$/.test(stripHexPrefix(raw));
}

export function expandAndConvertHex(raw: string): { rgb: RGB; hex: string } {
  const rgb = hexToRgb(raw);
  return { rgb, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
}
