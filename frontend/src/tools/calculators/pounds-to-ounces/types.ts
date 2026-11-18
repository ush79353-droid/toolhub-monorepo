/** Which field the user last edited. The other field is derived. */
export type LbOzSource = 'pounds' | 'ounces';

export interface PoundsToOuncesInput {
  source: LbOzSource;
  pounds: number | null;
  ounces: number | null;
}

export interface PoundsToOuncesResult {
  source: LbOzSource;
  pounds: number;
  ounces: number;
  explanation: string;
}

export type PoundsToOuncesFieldErrors = {
  pounds?: string;
  ounces?: string;
};

/** Exact: 1 avoirdupois pound = 16 avoirdupois ounces. */
export const OUNCES_PER_POUND = 16;

/** Exact: 1 international avoirdupois pound = 0.45359237 kg. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 oz = lb/16 = 0.028349523125 kg = 28.349523125 g. */
export const GRAMS_PER_OUNCE = (KG_PER_POUND * 1000) / OUNCES_PER_POUND;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 1 lb = 16 oz. */
export const DEFAULT_POUNDS_TO_OUNCES_INPUT: PoundsToOuncesInput = {
  source: 'pounds',
  pounds: 1,
  ounces: null,
};
