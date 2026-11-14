import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AppreciationRatePeriod, AppreciationResult } from './types';

function formatPlainMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * N (appreciation periods):
 * - Daily:   (Years + Months / 12) × 365
 * - Monthly: Years × 12 + Months
 * - Yearly:  Years + Months / 12
 *
 * Final Value = Starting Value × (1 + Rate / 100)^N
 */
export function periodsFromDuration(
  years: number,
  months: number,
  ratePeriod: AppreciationRatePeriod
): number | null {
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null;
  if (years < 0 || months < 0) return null;

  const totalYears = years + months / 12;
  let periods: number;
  switch (ratePeriod) {
    case 'daily':
      periods = totalYears * 365;
      break;
    case 'monthly':
      periods = years * 12 + months;
      break;
    case 'yearly':
      periods = totalYears;
      break;
  }

  return Number.isFinite(periods) ? periods : null;
}

export function calculateAppreciation(
  startingValue: number,
  appreciationRatePercent: number,
  years: number,
  months: number,
  ratePeriod: AppreciationRatePeriod,
  currency: SupportedCurrency
): AppreciationResult | null {
  if (!Number.isFinite(startingValue) || !Number.isFinite(appreciationRatePercent)) {
    return null;
  }
  if (!(startingValue > 0)) return null;
  if (!(appreciationRatePercent > -100)) return null;
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null;
  if (years < 0 || months < 0) return null;

  const periods = periodsFromDuration(years, months, ratePeriod);
  if (periods === null) return null;

  const growthFactor = 1 + appreciationRatePercent / 100;
  if (!(growthFactor > 0) || !Number.isFinite(growthFactor)) return null;

  const finalValue = startingValue * growthFactor ** periods;
  if (!Number.isFinite(finalValue)) return null;

  return {
    startingValue,
    appreciationRatePercent,
    ratePeriod,
    years,
    months,
    periods,
    finalValue,
    currency,
    formattedFinalValue: formatPlainMoney(finalValue, currency),
  };
}
