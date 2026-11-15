import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'number' | 'billion' | 'scientific';

export interface NumberBillionResult {
  absolute: DecimalValue;
  billion: DecimalValue;
  numberDisplay: string;
  numberGrouped: string;
  billionDisplay: string;
  scientificNotation: string;
  scientificE: string;
}

export type NumberBillionFieldErrors = Partial<
  Record<'number' | 'billion' | 'scientific', string>
>;

/** Short-scale: 1 billion = 10⁹. */
export const BILLION_POWER = 9;

export const DEFAULT_NUMBER_RAW = '1000000000';
export const DEFAULT_BILLION_RAW = '1';
