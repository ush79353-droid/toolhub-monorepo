export type SourceField = 'billion' | 'trillion' | 'scientific';

/**
 * Exact decimal: value = sign × digits × 10^exp
 * where `digits` is a nonnegative integer digit string (no leading zeros unless "0").
 */
export interface DecimalValue {
  sign: 1 | -1;
  digits: string;
  exp: number;
}

export interface BillionTrillionResult {
  billion: DecimalValue;
  trillion: DecimalValue;
  absolute: DecimalValue;
  billionDisplay: string;
  trillionDisplay: string;
  absoluteGrouped: string;
  scientificNotation: string;
  scientificE: string;
}

export type BillionTrillionFieldErrors = Partial<
  Record<'billion' | 'trillion' | 'scientific', string>
>;

/** Short-scale powers. */
export const BILLION_POWER = 9;
export const TRILLION_POWER = 12;
/** Billions per trillion (exact). */
export const BILLIONS_PER_TRILLION = 1000;

export const DEFAULT_BILLION_RAW = '1000';
export const DEFAULT_TRILLION_RAW = '1';
