import { KG_PER_POUND } from '../weight-converter/types';

/** Which field the user last edited. The other field is derived. */
export type LbsKgSource = 'pounds' | 'kilograms';

export interface LbsToKgInput {
  source: LbsKgSource;
  pounds: number | null;
  kilograms: number | null;
}

export interface LbsToKgResult {
  source: LbsKgSource;
  pounds: number;
  kilograms: number;
  explanation: string;
}

export type LbsToKgFieldErrors = {
  pounds?: string;
  kilograms?: string;
};

/** Exact: 1 international avoirdupois pound = 0.45359237 kg. */
export const KILOGRAMS_PER_POUND = KG_PER_POUND;

export const MAX_ABS_VALUE = 1e15;
