/** Extra length units in More Conversion Options (not primary ft/cm). */
export type ExtraLengthUnit = 'mm' | 'm' | 'km' | 'in' | 'yd' | 'mi';

export const EXTRA_LENGTH_UNITS = [
  'mm',
  'm',
  'km',
  'in',
  'yd',
  'mi',
] as const satisfies readonly ExtraLengthUnit[];

export const EXTRA_LENGTH_LABELS: Record<ExtraLengthUnit, string> = {
  mm: 'Millimeters',
  m: 'Meters',
  km: 'Kilometers',
  in: 'Inches',
  yd: 'Yards',
  mi: 'Miles',
};

export const EXTRA_LENGTH_SYMBOLS: Record<ExtraLengthUnit, string> = {
  mm: 'mm',
  m: 'm',
  km: 'km',
  in: 'in',
  yd: 'yd',
  mi: 'mi',
};

export type FootCmSource = 'feet' | 'centimeters' | ExtraLengthUnit;

export interface FootToCmInput {
  source: FootCmSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface FootToCmResult {
  source: FootCmSource;
  feet: number;
  centimeters: number;
  extras: Record<ExtraLengthUnit, number>;
  explanation: string;
}

export type FootToCmFieldErrors = Partial<Record<FootCmSource, string>>;

/**
 * Exact: 1 international foot = 0.3048 m = 30.48 cm.
 * Do not use the approximate reciprocal 0.03281 as an internal factor.
 */
export const CENTIMETERS_PER_FOOT = 30.48;

export const MAX_ABS_VALUE = 1e15;
