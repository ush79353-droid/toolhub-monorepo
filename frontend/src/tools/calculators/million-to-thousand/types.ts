import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'millions' | 'thousands' | 'decimal';

export interface MillionThousandResult {
  millions: DecimalValue;
  thousands: DecimalValue;
  absolute: DecimalValue;
  millionsDisplay: string;
  thousandsDisplay: string;
  decimalDisplay: string;
  decimalGrouped: string;
  scientificNotation: string;
  scientificE: string;
}

export type MillionThousandFieldErrors = Partial<
  Record<'millions' | 'thousands' | 'decimal', string>
>;

/** Exact powers: thousand = 10³, million = 10⁶. */
export const THOUSAND_POWER = 3;
export const MILLION_POWER = 6;
/** Thousands per million (exact). */
export const THOUSANDS_PER_MILLION = 1000;

export const DEFAULT_MILLIONS_RAW = '1';
export const DEFAULT_THOUSANDS_RAW = '1000';
export const DEFAULT_DECIMAL_RAW = '1000000';
