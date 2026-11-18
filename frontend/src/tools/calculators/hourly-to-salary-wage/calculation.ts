import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WageSourceField } from './types';

export const WEEKS_PER_YEAR = 52;
export const WORKDAYS_PER_WEEK = 5;

/**
 * Convert between hourly wage and annual salary, then derive period wages.
 *
 * Assumptions (disclosed in UI):
 *   Annual = Hourly × HoursPerWeek × 52
 *   Hourly = Annual / (HoursPerWeek × 52)
 *   Weekly = Hourly × HoursPerWeek  (= Annual / 52)
 *   Biweekly = Weekly × 2           (= Annual / 26)
 *   Monthly = Annual / 12
 *   Daily = Weekly / 5              (five-day working week)
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateWageFromSource(input: {
  hoursPerWeek: number;
  sourceField: WageSourceField;
  sourceAmount: number;
}): {
  annualHours: number;
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
} | null {
  const { hoursPerWeek, sourceField, sourceAmount } = input;
  if (![hoursPerWeek, sourceAmount].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0) return null;
  if (sourceAmount < 0) return null;

  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0) || !Number.isFinite(annualHours)) return null;

  let hourly: number;
  let annual: number;

  if (sourceField === 'hourly') {
    hourly = sourceAmount;
    annual = hourly * annualHours;
  } else {
    annual = sourceAmount;
    hourly = annual / annualHours;
  }

  if (![hourly, annual].every(Number.isFinite)) return null;
  if (hourly < 0 || annual < 0) return null;

  const weekly = hourly * hoursPerWeek;
  const biweekly = weekly * 2;
  const monthly = annual / 12;
  const daily = weekly / WORKDAYS_PER_WEEK;

  if (
    ![hourly, daily, weekly, biweekly, monthly, annual].every(Number.isFinite)
  ) {
    return null;
  }
  if (
    [hourly, daily, weekly, biweekly, monthly, annual].some((v) => v < 0)
  ) {
    return null;
  }

  return { annualHours, hourly, daily, weekly, biweekly, monthly, annual };
}

/** Display rounding only — never used inside the formulas. */
export function formatWageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
