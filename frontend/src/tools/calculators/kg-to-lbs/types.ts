import { KG_PER_POUND } from '../weight-converter/types';

/** Which field the user last edited. */
export type KgLbsSource = 'kg' | 'lbs';

export interface KgToLbsInput {
  source: KgLbsSource;
  kg: number | null;
  lbs: number | null;
}

export type KgToLbsFieldErrors = {
  kg?: string;
  lbs?: string;
};

/** Exact: 1 international avoirdupois pound. */
export { KG_PER_POUND };

/** Reciprocal: lb per kg. */
export const LBS_PER_KG = 1 / KG_PER_POUND;

export const MAX_ABS_VALUE = 1e15;
