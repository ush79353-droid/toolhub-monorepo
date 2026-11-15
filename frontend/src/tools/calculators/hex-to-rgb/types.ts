export type ConversionDirection = 'hex-to-rgb' | 'rgb-to-hex';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type HexRgbFieldErrors = Partial<Record<'r' | 'g' | 'b' | 'hex' | 'form', string>>;

export const DIRECTION_LABELS: Record<ConversionDirection, string> = {
  'hex-to-rgb': 'HEX to RGB',
  'rgb-to-hex': 'RGB to HEX',
};

export const DEFAULT_DIRECTION: ConversionDirection = 'hex-to-rgb';
export const DEFAULT_RGB: RGB = { r: 255, g: 131, b: 0 };
export const DEFAULT_HEX = '#FF8300';
export const DEFAULT_ALLOW_SHORTHAND = false;
