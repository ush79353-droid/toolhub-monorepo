import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WageSourceField } from './types';

export const WEEKS_PER_YEAR = 52;
export const WORKDAYS_PER_WEEK = 5;
export const SECONDS_PER_HOUR = 3600;
export const MINUTES_PER_HOUR = 60;

/**
 * Convert among wage periods from hours per week.
 *
 * Assumptions (disclosed in UI):
 *   Weekly = Hourly × HoursPerWeek
 *   Annual = Weekly × 52
 *   Monthly = Annual / 12
 *   Biweekly = Weekly × 2
 *   Daily = Weekly / 5
 *   PerMinute = Hourly / 60
 *   PerSecond = Hourly / 3600
 *
 * Reverse paths derive canonical hourly first, then recompute every period.
 * Full precision; no display rounding inside the formulas.
 */
export function calculateWagePeriods(input: {
  hoursPerWeek: number;
  sourceField: WageSourceField;
  sourceAmount: number;
}): {
  annualHours: number;
  hourly: number;
  perSecond: number;
  perMinute: number;
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
    case 'hourly':
      hourly = sourceAmount;
      break;
    case 'perSecond':
      hourly = sourceAmount * SECONDS_PER_HOUR;
      break;
    case 'perMinute':
      hourly = sourceAmount * MINUTES_PER_HOUR;
      break;
    case 'daily':
      // Daily = Weekly / 5 ⇒ Weekly = Daily × 5 ⇒ Hourly = Weekly / hours
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
  const perMinute = hourly / MINUTES_PER_HOUR;
  const perSecond = hourly / SECONDS_PER_HOUR;

  const values = [
    hourly,
    perSecond,
    perMinute,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  return {
    annualHours,
    hourly,
    perSecond,
    perMinute,
    daily,
    weekly,
    biweekly,
    monthly,
    annual,
  };
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
