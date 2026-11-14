import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { ExpectedUtilityResult } from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Risk-neutral linear utility: U(x) = x.
 * Expected Utility = (P1/100 × V1) + (P2/100 × V2)
 * Numerically equal to expected monetary value under this assumption.
 */
export function calculateExpectedUtility(params: {
  probability1: number;
  value1: number;
  probability2: number;
  value2: number;
  currency: SupportedCurrency;
}): ExpectedUtilityResult | null {
  const { probability1, value1, probability2, value2, currency } = params;

  if (![probability1, value1, probability2, value2].every(Number.isFinite)) {
    return null;
  }

  const expectedUtility = roundMoney(
    (probability1 / 100) * value1 + (probability2 / 100) * value2,
  );
  if (!Number.isFinite(expectedUtility)) return null;

  return {
    probability1,
    value1,
    probability2,
    value2,
    expectedUtility,
    currency,
    formattedExpectedUtility: formatCurrencyValue(expectedUtility, currency),
  };
}

export function describeResult(result: ExpectedUtilityResult): string {
  return `Expected utility: ${result.formattedExpectedUtility}`;
}
