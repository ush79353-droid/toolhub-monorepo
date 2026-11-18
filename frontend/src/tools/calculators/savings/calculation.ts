/**
 * Stub engine for UI scaffolding. Replaced with full compound-interest + APY
 * math and inflation/growth simulation in the calculations commit.
 */
import type { SavingsResult } from './types';
import type { SupportedCurrency } from '@/tools/shared/currency';

export function calculateSavings(_input: {
  resultCurrency: SupportedCurrency;
  [key: string]: unknown;
}): SavingsResult | null {
  return null;
}
