export type ConversionDirection = 'rgb-to-hex' | 'hex-to-rgb';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type RgbHexFieldErrors = Partial<Record<'r' | 'g' | 'b' | 'hex' | 'form', string>>;

export const DIRECTION_LABELS: Record<ConversionDirection, string> = {
  'rgb-to-hex': 'RGB to HEX',
  'hex-to-rgb': 'HEX to RGB',
};

export const DEFAULT_DIRECTION: ConversionDirection = 'rgb-to-hex';
export const DEFAULT_RGB: RGB = { r: 255, g: 100, b: 50 };
export const DEFAULT_HEX = '#FF6432';
