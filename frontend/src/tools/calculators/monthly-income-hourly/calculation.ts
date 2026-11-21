import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MonthlyIncomeHourlySourceField } from './types';

export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;

/**
 * Monthly ↔ hourly via annualized hours (hours/week × 52).
 *
 * Hourly = (Monthly × 12) / (Hours × 52)
 * Monthly = Hourly × Hours × 52 / 12
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateMonthlyIncomeHourly(input: {
  hoursPerWeek: number;
  sourceField: MonthlyIncomeHourlySourceField;
  sourceAmount: number;
}): {
  annualHours: number;
  monthly: number;
  hourly: number;
} | null {
  const { hoursPerWeek, sourceField, sourceAmount } = input;
  if (![hoursPerWeek, sourceAmount].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0) return null;
  if (sourceAmount < 0) return null;

  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0) || !Number.isFinite(annualHours)) return null;

  let monthly: number;
  let hourly: number;

  if (sourceField === 'monthly') {
    monthly = sourceAmount;
    hourly = (monthly * MONTHS_PER_YEAR) / annualHours;
  } else {
    hourly = sourceAmount;
    monthly = (hourly * annualHours) / MONTHS_PER_YEAR;
  }

  if (![monthly, hourly].every(Number.isFinite)) return null;
  if (monthly < 0 || hourly < 0) return null;

  return { annualHours, monthly, hourly };
}

export function formatMonthlyIncomeHourlyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
