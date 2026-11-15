import type {
  CanonicalColor,
  CMYK,
  ColorFormats,
  ColorModel,
  HSL,
  HSLA,
  HSV,
  RGB,
  RGBA,
} from './types';

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round(n: number, digits = 0): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function channelToHex(n: number): string {
  const v = clamp(Math.round(n), 0, 255);
  return v.toString(16).toUpperCase().padStart(2, '0');
}

function alphaToHex(a: number): string {
  return channelToHex(clamp(a, 0, 1) * 255);
}

export function hexToRgb(hex: string): RGB | null {
  const parsed = parseHex(hex);
  if (!parsed) return null;
  return { r: parsed.r, g: parsed.g, b: parsed.b };
}

export function parseHex(raw: string): RGBA | null {
  let s = raw.trim();
  if (s.startsWith('#')) s = s.slice(1);
  if (!/^[0-9a-fA-F]+$/.test(s)) return null;

  if (s.length === 3 || s.length === 4) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    const a = s.length === 4 ? parseInt(s[3] + s[3], 16) / 255 : 1;
    return { r, g, b, a: round(a, 4) };
  }

  if (s.length === 6 || s.length === 8) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    const a = s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a: round(a, 4) };
  }

  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  return `${rgbToHex(r, g, b)}${alphaToHex(a)}`;
}

export function hexToRgba(hex: string): RGBA | null {
  return parseHex(hex);
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: round(h, 2),
    s: round(s * 100, 2),
    l: round(l * 100, 2),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const hh = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ln - c / 2;
  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (hh < 60) [rn, gn, bn] = [c, x, 0];
  else if (hh < 120) [rn, gn, bn] = [x, c, 0];
  else if (hh < 180) [rn, gn, bn] = [0, c, x];
  else if (hh < 240) [rn, gn, bn] = [0, x, c];
  else if (hh < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  return {
    h: round(h, 2),
    s: round(s * 100, 2),
    v: round(max * 100, 2),
  };
}

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const hh = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vn - c;
  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (hh < 60) [rn, gn, bn] = [c, x, 0];
  else if (hh < 120) [rn, gn, bn] = [x, c, 0];
  else if (hh < 180) [rn, gn, bn] = [0, c, x];
  else if (hh < 240) [rn, gn, bn] = [0, x, c];
  else if (hh < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

/** CMYK channels as percentages 0–100. */
export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rn = clamp(r, 0, 255) / 255;
  const gn = clamp(g, 0, 255) / 255;
  const bn = clamp(b, 0, 255) / 255;
  const k = 1 - Math.max(rn, gn, bn);

  if (k >= 1 - Number.EPSILON) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = ((1 - rn - k) / (1 - k)) * 100;
  const m = ((1 - gn - k) / (1 - k)) * 100;
  const y = ((1 - bn - k) / (1 - k)) * 100;
  return {
    c: round(c, 2),
    m: round(m, 2),
    y: round(y, 2),
    k: round(k * 100, 2),
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
  const cn = clamp(c, 0, 100) / 100;
  const mn = clamp(m, 0, 100) / 100;
  const yn = clamp(y, 0, 100) / 100;
  const kn = clamp(k, 0, 100) / 100;
  return {
    r: Math.round(255 * (1 - cn) * (1 - kn)),
    g: Math.round(255 * (1 - mn) * (1 - kn)),
    b: Math.round(255 * (1 - yn) * (1 - kn)),
  };
}

export function rgbaToHsla(r: number, g: number, b: number, a: number): HSLA {
  const hsl = rgbToHsl(r, g, b);
  return { ...hsl, a: round(clamp(a, 0, 1), 4) };
}

export function hslaToRgba(h: number, s: number, l: number, a: number): RGBA {
  const rgb = hslToRgb(h, s, l);
  return { ...rgb, a: clamp(a, 0, 1) };
}

export function formatsFromCanonical(color: CanonicalColor): ColorFormats {
  const { r, g, b, a } = color;
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  const hex = rgbToHex(r, g, b);
  const hexAlpha = rgbaToHex(r, g, b, a);
  const aFmt = round(a, 4);

  return {
    hex,
    hexAlpha,
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${aFmt})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${aFmt})`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    rgbValues: { r, g, b },
    rgbaValues: { r, g, b, a: aFmt },
    hslValues: hsl,
    hslaValues: { ...hsl, a: aFmt },
    hsvValues: hsv,
    cmykValues: cmyk,
  };
}

export function cssPreview(color: CanonicalColor): string {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${round(a, 4)})`;
}

function fmtNum(n: number, digits = 2): string {
  if (Number.isInteger(n)) return String(n);
  const t = round(n, digits);
  return String(t);
}

/** Populate input fields for a model from the canonical color. */
export function fieldsFromCanonical(
  model: ColorModel,
  color: CanonicalColor,
): Record<string, string> {
  const { r, g, b, a } = color;
  switch (model) {
    case 'HEX':
      return { hex: a < 1 ? rgbaToHex(r, g, b, a) : rgbToHex(r, g, b) };
    case 'RGB':
      return { r: String(r), g: String(g), b: String(b) };
    case 'RGBA':
      return { r: String(r), g: String(g), b: String(b), a: fmtNum(a, 4) };
    case 'HSL': {
      const hsl = rgbToHsl(r, g, b);
      return { h: fmtNum(hsl.h), s: fmtNum(hsl.s), l: fmtNum(hsl.l) };
    }
    case 'HSLA': {
      const hsl = rgbToHsl(r, g, b);
      return {
        h: fmtNum(hsl.h),
        s: fmtNum(hsl.s),
        l: fmtNum(hsl.l),
        a: fmtNum(a, 4),
      };
    }
    case 'HSV': {
      const hsv = rgbToHsv(r, g, b);
      return { h: fmtNum(hsv.h), s: fmtNum(hsv.s), v: fmtNum(hsv.v) };
    }
    case 'CMYK': {
      const cmyk = rgbToCmyk(r, g, b);
      return {
        c: fmtNum(cmyk.c),
        m: fmtNum(cmyk.m),
        y: fmtNum(cmyk.y),
        k: fmtNum(cmyk.k),
      };
    }
    default:
      return {};
  }
}

export function emptyFields(model: ColorModel): Record<string, string> {
  switch (model) {
    case 'HEX':
      return { hex: '' };
    case 'RGB':
      return { r: '', g: '', b: '' };
    case 'RGBA':
      return { r: '', g: '', b: '', a: '' };
    case 'HSL':
      return { h: '', s: '', l: '' };
    case 'HSLA':
      return { h: '', s: '', l: '', a: '' };
    case 'HSV':
      return { h: '', s: '', v: '' };
    case 'CMYK':
      return { c: '', m: '', y: '', k: '' };
    default:
      return {};
  }
}

export const DEFAULT_COLOR: CanonicalColor = {
  r: 255,
  g: 100,
  b: 50,
  a: 1,
};
