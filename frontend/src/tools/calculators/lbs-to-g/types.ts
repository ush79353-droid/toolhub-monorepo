/** Which field the user last edited. The other field is derived. */
export type LbsGSource = 'pounds' | 'grams';

export interface LbsToGInput {
  source: LbsGSource;
  pounds: number | null;
  grams: number | null;
}

export interface LbsToGResult {
  source: LbsGSource;
  pounds: number;
  grams: number;
  explanation: string;
}

export type LbsToGFieldErrors = {
  pounds?: string;
  grams?: string;
};

/** Exact: 1 international avoirdupois pound = 453.59237 g. */
export const GRAMS_PER_POUND = 453.59237;

export const MAX_ABS_VALUE = 1e15;
