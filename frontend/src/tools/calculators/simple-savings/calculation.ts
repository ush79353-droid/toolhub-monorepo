/**
 * Stub engine for UI scaffolding. Compound-interest + APY math and FX
 * normalization land in the calculations commit (reuses savings formulas).
 */
import type { SavingsResult } from './types';
import type { SupportedCurrency } from '@/tools/shared/currency';

export function calculateSimpleSavings(_input: {
  resultCurrency: SupportedCurrency;
  [key: string]: unknown;
}): SavingsResult | null {
  return null;
}
