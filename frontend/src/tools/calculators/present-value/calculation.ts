import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PresentValueResult } from './types';

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * PV = FV / (1 + r)^n
 * Total Interest = FV − PV
 * Rate is per period (must match the period frequency).
 */
export function calculatePresentValue(input: {
  futureValue: number;
  periods: number;
  interestRatePercent: number;
  currency: SupportedCurrency;
}): PresentValueResult | null {
  const { futureValue, periods, interestRatePercent, currency } = input;

  if (![futureValue, periods, interestRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (futureValue < 0) return null;
  if (periods < 0 || !Number.isInteger(periods)) return null;
  if (!(1 + interestRatePercent / 100 > 0)) return null;

  const r = interestRatePercent / 100;
  const factor = (1 + r) ** periods;
  if (!Number.isFinite(factor) || factor === 0) return null;

  const presentValue = futureValue / factor;
  if (!Number.isFinite(presentValue)) return null;

  const totalInterest = futureValue - presentValue;
  if (!Number.isFinite(totalInterest)) return null;

  return {
    presentValue,
    totalInterest,
    presentValueDisplay: formatMoney(presentValue, currency),
    totalInterestDisplay: formatMoney(totalInterest, currency),
    currency,
  };
}
