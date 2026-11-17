/** Which field the user last edited. The other field is derived. */
export type GLbsSource = 'grams' | 'pounds';

export interface GToLbsInput {
  source: GLbsSource;
  /** null while the active source field is blank or incomplete. */
  grams: number | null;
  pounds: number | null;
}

export interface GToLbsResult {
  source: GLbsSource;
  grams: number;
  pounds: number;
  explanation: string;
}

export type GToLbsFieldErrors = {
  grams?: string;
  pounds?: string;
};

/** Exact: 1 international avoirdupois pound = 453.59237 g. */
export const GRAMS_PER_POUND = 453.59237;

export const MAX_ABS_VALUE = 1e15;
