import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'number' | 'million';

export interface NumberMillionResult {
  absolute: DecimalValue;
  million: DecimalValue;
  numberDisplay: string;
  numberGrouped: string;
  millionDisplay: string;
  scientificNotation: string;
  scientificE: string;
}

export type NumberMillionFieldErrors = Partial<Record<'number' | 'million', string>>;

/** Short-scale: 1 million = 10⁶. */
export const MILLION_POWER = 6;

export const DEFAULT_NUMBER_RAW = '1000000';
export const DEFAULT_MILLION_RAW = '1';
