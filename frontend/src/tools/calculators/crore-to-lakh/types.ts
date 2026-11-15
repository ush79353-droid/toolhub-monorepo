import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'crore' | 'lakh';

export interface CroreLakhResult {
  crore: DecimalValue;
  lakh: DecimalValue;
  /** Absolute count (crore × 10⁷). */
  absolute: DecimalValue;
  croreDisplay: string;
  lakhDisplay: string;
  absoluteInternational: string;
  absoluteIndian: string;
}

export type CroreLakhFieldErrors = Partial<Record<'crore' | 'lakh', string>>;

/** Exact: 1 crore = 100 lakh. */
export const LAKHS_PER_CRORE = 100;
export const CRORE_POWER = 7;
export const LAKH_POWER = 5;

export const DEFAULT_CRORE_RAW = '1';
export const DEFAULT_LAKH_RAW = '100';
