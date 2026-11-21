import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MoneyPerHourSourceField } from './types';

export const WEEKS_PER_YEAR = 52;
export const WORKDAYS_PER_WEEK = 5;

/**
 * Convert a period wage into money per hour (and peer periods).
 *
 * Assumptions (disclosed in UI):
 *   Annual hours = HoursPerWeek × 52
 *   Hourly = Annual / annualHours
 *   Weekly = Hourly × HoursPerWeek
 *   Biweekly = Weekly × 2
 *   Monthly = Annual / 12
 *   Daily = Weekly / 5
 *
 * Reverse paths derive canonical hourly first, then recompute every period.
 * Full precision; no display rounding inside the formulas.
 */
export function calculateMoneyPerHour(input: {
  hoursPerWeek: number;
  sourceField: MoneyPerHourSourceField;
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
  switch (sourceField) {
    case 'daily':
      hourly = (sourceAmount * WORKDAYS_PER_WEEK) / hoursPerWeek;
      break;
    case 'weekly':
      hourly = sourceAmount / hoursPerWeek;
      break;
    case 'biweekly':
      hourly = sourceAmount / 2 / hoursPerWeek;
      break;
    case 'monthly': {
      const annual = sourceAmount * 12;
      hourly = annual / annualHours;
      break;
    }
    case 'annual':
      hourly = sourceAmount / annualHours;
      break;
  }

  if (!Number.isFinite(hourly) || hourly < 0) return null;

  const weekly = hourly * hoursPerWeek;
  const annual = weekly * WEEKS_PER_YEAR;
  const monthly = annual / 12;
  const biweekly = weekly * 2;
  const daily = weekly / WORKDAYS_PER_WEEK;

  const values = [hourly, daily, weekly, biweekly, monthly, annual];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  return {
    annualHours,
    hourly,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatMoneyPerHourMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
