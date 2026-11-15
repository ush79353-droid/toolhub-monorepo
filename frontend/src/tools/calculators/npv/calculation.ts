import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { NpvResult } from './types';

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Expected cash flows (OmniCalculator): present value of future cash flows only
 * (excludes initial costs) = Σ CF_t / (1 + r)^t
 *
 * NPV = −Initial Costs + Expected cash flows
 */
export function calculateNpv(input: {
  discountRatePercent: number;
  initialCosts: number;
  cashFlows: number[];
  currency: SupportedCurrency;
}): NpvResult | null {
  const { discountRatePercent, initialCosts, cashFlows, currency } = input;

  if (![discountRatePercent, initialCosts].every(Number.isFinite)) return null;
  if (initialCosts < 0) return null;
  if (!(1 + discountRatePercent / 100 > 0)) return null;
  if (!cashFlows.length || !cashFlows.every(Number.isFinite)) return null;

  const r = discountRatePercent / 100;
  let expectedCashFlows = 0;

  for (let t = 0; t < cashFlows.length; t += 1) {
    const year = t + 1;
    const denom = (1 + r) ** year;
    if (!Number.isFinite(denom) || denom === 0) return null;
    const discounted = cashFlows[t]! / denom;
    if (!Number.isFinite(discounted)) return null;
    expectedCashFlows += discounted;
  }

  if (!Number.isFinite(expectedCashFlows)) return null;

  const npv = -initialCosts + expectedCashFlows;
  if (!Number.isFinite(npv)) return null;

  return {
    npv,
    expectedCashFlows,
    npvDisplay: formatMoney(npv, currency),
    expectedCashFlowsDisplay: formatMoney(expectedCashFlows, currency),
    yearsUsed: cashFlows.length,
    currency,
  };
}
