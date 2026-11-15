import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'million' | 'billion' | 'fullNumber';

export interface MillionBillionResult {
  absolute: DecimalValue;
  million: DecimalValue;
  billion: DecimalValue;
  millionDisplay: string;
  millionGrouped: string;
  billionDisplay: string;
  fullNumberDisplay: string;
  fullNumberGrouped: string;
  scientificNotation: string;
  scientificE: string;
}

export type MillionBillionFieldErrors = Partial<
  Record<'million' | 'billion' | 'fullNumber', string>
>;

/** Short-scale: 1 million = 10⁶, 1 billion = 10⁹, 1 billion = 1,000 million. */
export const MILLION_POWER = 6;
export const BILLION_POWER = 9;
export const MILLIONS_PER_BILLION = 1_000;

export const DEFAULT_MILLION_RAW = '1000';
export const DEFAULT_BILLION_RAW = '1';
export const DEFAULT_FULL_NUMBER_RAW = '1000000000';
