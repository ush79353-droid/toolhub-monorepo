import { cmykToRgb, hslToRgb, hsvToRgb, parseHex } from './calculation';
import type { CanonicalColor, ColorFieldErrors, ColorModel } from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim();
  if (t === '' || t === '-' || t === '.' || t === '-.') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function requireChannel(
  raw: string,
  label: string,
  min: number,
  max: number,
  integer: boolean,
): { value: number | null; error?: string } {
  const n = parseNumber(raw);
  if (n === null) {
    if (raw.trim() === '') return { value: null, error: `${label} is required.` };
    return { value: null, error: `${label} must be a number.` };
  }
  if (integer && !Number.isInteger(n)) {
    return { value: null, error: `${label} must be a whole number.` };
  }
  if (n < min || n > max) {
    if (label === 'Alpha') return { value: null, error: 'Alpha must be between 0 and 1.' };
    if (max === 100) return { value: null, error: `${label} must be between 0% and 100%.` };
    if (max === 255) return { value: null, error: `${label} must be between 0 and 255.` };
    if (label === 'Hue') return { value: null, error: 'Hue must be between 0° and 360°.' };
    return { value: null, error: `${label} must be between ${min} and ${max}.` };
  }
  return { value: n };
}

function hexHasAlpha(raw: string): boolean {
  const s = raw.trim().replace(/^#/, '');
  return s.length === 4 || s.length === 8;
}

export function parseColorFields(
  model: ColorModel,
  fields: Record<string, string>,
  preservedAlpha: number,
): { ok: true; color: CanonicalColor } | { ok: false; errors: ColorFieldErrors } {
  const errors: ColorFieldErrors = {};

  if (model === 'HEX') {
    const raw = fields.hex ?? '';
    if (!raw.trim()) {
      return { ok: false, errors: { hex: 'Enter a valid hexadecimal color code.' } };
    }
    const parsed = parseHex(raw);
    if (!parsed) {
      return { ok: false, errors: { hex: 'Enter a valid hexadecimal color code.' } };
    }
    return {
      ok: true,
      color: {
        r: parsed.r,
        g: parsed.g,
        b: parsed.b,
        a: hexHasAlpha(raw) ? parsed.a : preservedAlpha,
      },
    };
  }

  if (model === 'RGB' || model === 'RGBA') {
    const r = requireChannel(fields.r ?? '', 'Red', 0, 255, true);
    const g = requireChannel(fields.g ?? '', 'Green', 0, 255, true);
    const b = requireChannel(fields.b ?? '', 'Blue', 0, 255, true);
    if (r.error) errors.r = r.error;
    if (g.error) errors.g = g.error;
    if (b.error) errors.b = b.error;

    let a = preservedAlpha;
    if (model === 'RGBA') {
      const alpha = requireChannel(fields.a ?? '', 'Alpha', 0, 1, false);
      if (alpha.error) errors.a = alpha.error;
      else if (alpha.value !== null) a = alpha.value;
    }

    if (Object.keys(errors).length || r.value === null || g.value === null || b.value === null) {
      return { ok: false, errors };
    }
    return { ok: true, color: { r: r.value, g: g.value, b: b.value, a } };
  }

  if (model === 'HSL' || model === 'HSLA') {
    const h = requireChannel(fields.h ?? '', 'Hue', 0, 360, false);
    const s = requireChannel(fields.s ?? '', 'Saturation', 0, 100, false);
    const l = requireChannel(fields.l ?? '', 'Lightness', 0, 100, false);
    if (h.error) errors.h = h.error;
    if (s.error) errors.s = s.error;
    if (l.error) errors.l = l.error;

    let a = preservedAlpha;
    if (model === 'HSLA') {
      const alpha = requireChannel(fields.a ?? '', 'Alpha', 0, 1, false);
      if (alpha.error) errors.a = alpha.error;
      else if (alpha.value !== null) a = alpha.value;
    }

    if (Object.keys(errors).length || h.value === null || s.value === null || l.value === null) {
      return { ok: false, errors };
    }
    const rgb = hslToRgb(h.value, s.value, l.value);
    return { ok: true, color: { ...rgb, a } };
  }

  if (model === 'HSV') {
    const h = requireChannel(fields.h ?? '', 'Hue', 0, 360, false);
    const s = requireChannel(fields.s ?? '', 'Saturation', 0, 100, false);
    const v = requireChannel(fields.v ?? '', 'Value', 0, 100, false);
    if (h.error) errors.h = h.error;
    if (s.error) errors.s = s.error;
    if (v.error) errors.v = v.error;
    if (Object.keys(errors).length || h.value === null || s.value === null || v.value === null) {
      return { ok: false, errors };
    }
    const rgb = hsvToRgb(h.value, s.value, v.value);
    return { ok: true, color: { ...rgb, a: preservedAlpha } };
  }

  if (model === 'CMYK') {
    const c = requireChannel(fields.c ?? '', 'Cyan', 0, 100, false);
    const m = requireChannel(fields.m ?? '', 'Magenta', 0, 100, false);
    const y = requireChannel(fields.y ?? '', 'Yellow', 0, 100, false);
    const k = requireChannel(fields.k ?? '', 'Black', 0, 100, false);
    if (c.error) errors.c = c.error;
    if (m.error) errors.m = m.error;
    if (y.error) errors.y = y.error;
    if (k.error) errors.k = k.error;
    if (
      Object.keys(errors).length ||
      c.value === null ||
      m.value === null ||
      y.value === null ||
      k.value === null
    ) {
      return { ok: false, errors };
    }
    const rgb = cmykToRgb(c.value, m.value, y.value, k.value);
    return { ok: true, color: { ...rgb, a: preservedAlpha } };
  }

  return { ok: false, errors: { form: 'Unsupported color model.' } };
}
