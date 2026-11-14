import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'cents' | 'euros';

export interface CentsEurosResult {
  cents: DecimalValue;
  euros: DecimalValue;
  centsDisplay: string;
  eurosDisplay: string;
  /** Formatted euro amount for summaries, e.g. €2.50 */
  eurosFormatted: string;
  summaryLine: string;
}

export type CentsEurosFieldErrors = Partial<Record<'cents' | 'euros', string>>;

/** Exact: 1 euro = 100 cents. */
export const CENTS_PER_EURO = 100;

export const DEFAULT_CENTS_RAW = '100';
export const DEFAULT_EUROS_RAW = '1';
