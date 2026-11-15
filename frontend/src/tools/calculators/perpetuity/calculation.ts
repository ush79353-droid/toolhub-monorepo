import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PerpetuityResult } from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Growing perpetuity (Gordon Growth), treating Dividend as D₁:
 * Present Value = Dividend / (Discount Rate − Growth Rate)
 * Rates are percent inputs converted to decimals.
 */
export function calculatePerpetuity(input: {
  dividend: number;
  discountRatePercent: number;
  growthRatePercent: number;
  currency: SupportedCurrency;
}): PerpetuityResult | null {
  const { dividend, discountRatePercent, growthRatePercent, currency } = input;

  if (![dividend, discountRatePercent, growthRatePercent].every(Number.isFinite)) {
    return null;
  }
  if (dividend < 0) return null;

  const discount = discountRatePercent / 100;
  const growth = growthRatePercent / 100;
  const spread = discount - growth;

  if (!Number.isFinite(spread) || spread <= 0) return null;

  const presentValue = dividend / spread;
  if (!Number.isFinite(presentValue)) return null;

  const rounded = roundMoney(presentValue);
  return {
    presentValue: rounded,
    currency,
    formattedPresentValue: formatMoney(rounded, currency),
  };
}
