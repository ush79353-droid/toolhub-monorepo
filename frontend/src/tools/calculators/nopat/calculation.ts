import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { NopatFormulaMode, NopatResult } from './types';

/**
 * Simple NOPAT = Operating Profit × (1 − Tax Rate / 100)
 * Tax rate is a percent (0–100). Negative operating profit is allowed.
 */
export function calculateSimpleNopat(
  operatingProfit: number,
  taxRatePercent: number
): number | null {
  if (!Number.isFinite(operatingProfit) || !Number.isFinite(taxRatePercent)) {
    return null;
  }
  if (taxRatePercent < 0 || taxRatePercent > 100) return null;
  const nopat = operatingProfit * (1 - taxRatePercent / 100);
  return Number.isFinite(nopat) ? nopat : null;
}

/**
 * Precise NOPAT (OmniCalculator / income-statement reconstruction):
 * (Net income + Non-operating income loss − Non-operating income gain
 *  + Interest expense + Tax) × (1 − Tax Rate / 100)
 */
export function calculatePreciseNopat(
  netIncome: number,
  nonOperatingIncomeLoss: number,
  nonOperatingIncomeGain: number,
  interestExpense: number,
  tax: number,
  taxRatePercent: number
): number | null {
  if (
    !Number.isFinite(netIncome) ||
    !Number.isFinite(nonOperatingIncomeLoss) ||
    !Number.isFinite(nonOperatingIncomeGain) ||
    !Number.isFinite(interestExpense) ||
    !Number.isFinite(tax) ||
    !Number.isFinite(taxRatePercent)
  ) {
    return null;
  }
  if (taxRatePercent < 0 || taxRatePercent > 100) return null;

  const operatingIncome =
    netIncome +
    nonOperatingIncomeLoss -
    nonOperatingIncomeGain +
    interestExpense +
    tax;
  if (!Number.isFinite(operatingIncome)) return null;

  const nopat = operatingIncome * (1 - taxRatePercent / 100);
  return Number.isFinite(nopat) ? nopat : null;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildNopatResult(params: {
  mode: NopatFormulaMode;
  operatingProfit: number;
  taxRatePercent: number;
  netIncome: number;
  nonOperatingIncomeLoss: number;
  nonOperatingIncomeGain: number;
  interestExpense: number;
  tax: number;
  currency: SupportedCurrency;
}): NopatResult {
  const nopat =
    params.mode === 'simple'
      ? calculateSimpleNopat(params.operatingProfit, params.taxRatePercent)
      : calculatePreciseNopat(
          params.netIncome,
          params.nonOperatingIncomeLoss,
          params.nonOperatingIncomeGain,
          params.interestExpense,
          params.tax,
          params.taxRatePercent
        );

  return {
    nopat,
    nopatDisplay: nopat === null ? '' : formatMoney(nopat, params.currency),
    currency: params.currency,
    mode: params.mode,
  };
}
