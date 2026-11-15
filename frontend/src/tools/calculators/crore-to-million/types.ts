import type { DecimalValue } from '../billion-to-trillion/types';

export type { DecimalValue };
export type SourceField = 'crore' | 'million';

export interface CroreMillionResult {
  crore: DecimalValue;
  million: DecimalValue;
  /** Absolute count (crore × 10⁷). */
  absolute: DecimalValue;
  croreDisplay: string;
  millionDisplay: string;
  absoluteInternational: string;
  absoluteIndian: string;
}

export type CroreMillionFieldErrors = Partial<Record<'crore' | 'million', string>>;

/** Exact: 1 crore = 10 million. */
export const MILLIONS_PER_CRORE = 10;
export const CRORE_POWER = 7;
export const MILLION_POWER = 6;

export const DEFAULT_CRORE_RAW = '1';
export const DEFAULT_MILLION_RAW = '10';
