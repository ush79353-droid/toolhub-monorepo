/** Which field the user last edited. The other field is derived. */
export type LbGSource = 'pounds' | 'grams';

export interface PoundsToGramsInput {
  source: LbGSource;
  pounds: number | null;
  grams: number | null;
}

export interface PoundsToGramsResult {
  source: LbGSource;
  pounds: number;
  grams: number;
  explanation: string;
}

export type PoundsToGramsFieldErrors = {
  pounds?: string;
  grams?: string;
};

/** Exact: 1 international avoirdupois pound = 453.59237 g. */
export const GRAMS_PER_POUND = 453.59237;

/** Exact: 1 kg = 1000 g; 1 lb = 0.45359237 kg. */
export const KG_PER_POUND = 0.45359237;
export const POUNDS_PER_KG = 1 / KG_PER_POUND;

export const MAX_ABS_VALUE = 1e15;

/** Demo default matching reference: 1 lb = 453.59237 g. */
export const DEFAULT_POUNDS_TO_GRAMS_INPUT: PoundsToGramsInput = {
  source: 'pounds',
  pounds: 1,
  grams: null,
};
