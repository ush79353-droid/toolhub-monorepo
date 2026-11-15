export type ColorModel = 'HEX' | 'RGB' | 'RGBA' | 'HSL' | 'HSLA' | 'HSV' | 'CMYK';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSLA extends HSL {
  a: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

/** Canonical sRGB + alpha. Channels r/g/b are 0–255; a is 0–1. */
export type CanonicalColor = RGBA;

export interface ColorFormats {
  hex: string;
  hexAlpha: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  hsv: string;
  cmyk: string;
  rgbValues: RGB;
  rgbaValues: RGBA;
  hslValues: HSL;
  hslaValues: HSLA;
  hsvValues: HSV;
  cmykValues: CMYK;
}

export type ColorFieldErrors = Partial<Record<string, string>>;

export interface ColorModelOption {
  id: ColorModel;
  label: string;
}

export const COLOR_MODEL_OPTIONS: readonly ColorModelOption[] = [
  { id: 'RGB', label: 'RGB (red, green, blue)' },
  { id: 'HEX', label: 'HEX (hexadecimal)' },
  { id: 'HSL', label: 'HSL (hue, saturation, lightness)' },
  { id: 'HSV', label: 'HSV / HSB (hue, saturation, value)' },
  { id: 'CMYK', label: 'CMYK (cyan, magenta, yellow, black)' },
  { id: 'RGBA', label: 'RGBA (red, green, blue, alpha)' },
  { id: 'HSLA', label: 'HSLA (hue, saturation, lightness, alpha)' },
];

export const DEFAULT_MODEL: ColorModel = 'RGB';
export const DEFAULT_RGB: RGB = { r: 255, g: 100, b: 50 };
export const DEFAULT_ALPHA = 1;
