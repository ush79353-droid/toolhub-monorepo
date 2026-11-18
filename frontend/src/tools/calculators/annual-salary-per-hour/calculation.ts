import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WageSourceField } from './types';

export const WEEKS_PER_YEAR = 52;
export const WORKDAYS_PER_WEEK = 5;

/**
 * Convert among hourly / daily / weekly / monthly / annual wages.
 *
 * Assumptions (disclosed in UI):
 *   annualHours = hoursPerWeek × 52
 *   annual = hourly × annualHours
 *   weekly = annual / 52
 *   monthly = annual / 12
 *   daily = weekly / 5  (five-day working week)
 *
 * Reverse paths derive annual first from the authoritative source field,
 * then recompute every other period. Full precision; no display rounding.
 */
export function calculateWagePeriods(input: {
  hoursPerWeek: number;
  sourceField: WageSourceField;
  sourceAmount: number;
}): {
  annualHours: number;
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
} | null {
  const { hoursPerWeek, sourceField, sourceAmount } = input;
  if (![hoursPerWeek, sourceAmount].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0) return null;
  if (sourceAmount < 0) return null;

  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0) || !Number.isFinite(annualHours)) return null;

  let annual: number;
  switch (sourceField) {
    case 'hourly':
      annual = sourceAmount * annualHours;
      break;
    case 'daily':
      annual = sourceAmount * WORKDAYS_PER_WEEK * WEEKS_PER_YEAR;
      break;
    case 'weekly':
      annual = sourceAmount * WEEKS_PER_YEAR;
      break;
    case 'monthly':
      annual = sourceAmount * 12;
      break;
    case 'annual':
      annual = sourceAmount;
      break;
  }

  if (!Number.isFinite(annual) || annual < 0) return null;

  const weekly = annual / WEEKS_PER_YEAR;
  const monthly = annual / 12;
  const daily = weekly / WORKDAYS_PER_WEEK;
  const hourly = annual / annualHours;

  if (![hourly, daily, weekly, monthly, annual].every(Number.isFinite)) {
    return null;
  }
  if ([hourly, daily, weekly, monthly, annual].some((v) => v < 0)) {
    return null;
  }

  return { annualHours, hourly, daily, weekly, monthly, annual };
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
