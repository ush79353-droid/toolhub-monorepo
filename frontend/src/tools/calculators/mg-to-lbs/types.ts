/** Which field the user last edited. The other field is derived. */
export type MgLbsSource = 'milligrams' | 'pounds';

export interface MgToLbsInput {
  source: MgLbsSource;
  milligrams: number | null;
  pounds: number | null;
}

export interface MgToLbsResult {
  source: MgLbsSource;
  milligrams: number;
  pounds: number;
  explanation: string;
}

export type MgToLbsFieldErrors = {
  milligrams?: string;
  pounds?: string;
};

/** Exact: 1 international avoirdupois pound = 453,592.37 mg. */
export const MILLIGRAMS_PER_POUND = 453_592.37;

export const MAX_ABS_VALUE = 1e15;
