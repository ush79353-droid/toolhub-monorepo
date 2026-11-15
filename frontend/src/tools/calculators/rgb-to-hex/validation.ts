import { hexToRgb, rgbToHex } from './calculation';
import type { RGB, RgbHexFieldErrors } from './types';

function parseChannel(
  raw: string,
  label: string,
): { value: number | null; error?: string } {
  const t = raw.trim();
  if (t === '') return { value: null, error: `${label} is required.` };
  const n = Number(t);
  if (!Number.isFinite(n)) return { value: null, error: `${label} must be a number.` };
  if (!Number.isInteger(n)) {
    return { value: null, error: `${label} must be a whole number.` };
  }
  if (n < 0 || n > 255) {
    return { value: null, error: `${label} must be between 0 and 255.` };
  }
  return { value: n };
}

export function parseRgbFields(
  fields: { r: string; g: string; b: string },
): { ok: true; rgb: RGB; hex: string } | { ok: false; errors: RgbHexFieldErrors } {
  const r = parseChannel(fields.r, 'Red');
  const g = parseChannel(fields.g, 'Green');
  const b = parseChannel(fields.b, 'Blue');
  const errors: RgbHexFieldErrors = {};
  if (r.error) errors.r = r.error;
  if (g.error) errors.g = g.error;
  if (b.error) errors.b = b.error;
  if (r.value === null || g.value === null || b.value === null || Object.keys(errors).length) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    rgb: { r: r.value, g: g.value, b: b.value },
    hex: rgbToHex(r.value, g.value, b.value),
  };
}

export function parseHexField(
  raw: string,
): { ok: true; rgb: RGB; hex: string } | { ok: false; errors: RgbHexFieldErrors } {
  if (!raw.trim()) {
    return { ok: false, errors: { hex: 'Enter a valid 3-digit or 6-digit HEX color code.' } };
  }
  try {
    const rgb = hexToRgb(raw);
    return { ok: true, rgb, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
  } catch {
    return { ok: false, errors: { hex: 'Enter a valid 3-digit or 6-digit HEX color code.' } };
  }
}
