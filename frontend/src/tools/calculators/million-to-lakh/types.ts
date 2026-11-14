import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'million' | 'lakh';

export interface MillionLakhResult {
  million: DecimalValue;
  lakh: DecimalValue;
  /** Absolute count (million × 10⁶). */
  absolute: DecimalValue;
  millionDisplay: string;
  lakhDisplay: string;
  absoluteInternational: string;
  absoluteIndian: string;
}

export type MillionLakhFieldErrors = Partial<Record<'million' | 'lakh', string>>;

/** Exact: 1 million = 10 lakh. */
export const LAKHS_PER_MILLION = 10;
export const MILLION_POWER = 6;
export const LAKH_POWER = 5;

export const DEFAULT_MILLION_RAW = '1';
export const DEFAULT_LAKH_RAW = '10';
