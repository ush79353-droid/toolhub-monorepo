/** Which field the user last edited. The other field is derived (identity). */
export type LbLbsSource = 'pounds' | 'lbs';

export interface PoundsToLbsInput {
  source: LbLbsSource;
  pounds: number | null;
  lbs: number | null;
}

export interface PoundsToLbsResult {
  source: LbLbsSource;
  pounds: number;
  lbs: number;
  explanation: string;
}

export type PoundsToLbsFieldErrors = {
  pounds?: string;
  lbs?: string;
};

/** Exact SI: 1 international avoirdupois pound = 0.45359237 kg (for education only). */
export const KG_PER_POUND = 0.45359237;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 1 pound = 1 lb. */
export const DEFAULT_POUNDS_TO_LBS_INPUT: PoundsToLbsInput = {
  source: 'pounds',
  pounds: 1,
  lbs: null,
};
