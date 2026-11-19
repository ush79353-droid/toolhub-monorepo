import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WageSourceField } from './types';

export const WEEKS_PER_YEAR = 52;

/**
 * Convert hourly, daily, or weekly wage into weekly / monthly / yearly salary.
 *
 * Assumptions (disclosed in UI):
 *   Hourly → Weekly = Hourly × HoursPerWeek
 *   Daily  → Weekly = Daily × DaysPerWeek
 *   Weekly → Weekly = entered weekly wage
 *   Yearly  = Weekly × 52
 *   Monthly = Weekly × 52 / 12
 *
 * Peer hourly/daily/weekly values are synchronized from the weekly total for
 * display only — they never feed back into the authoritative source.
 * Full precision; no display rounding inside the formulas.
 */
export function calculateWageToSalary(input: {
  sourceField: WageSourceField;
  sourceAmount: number;
  hoursPerWeek: number;
  daysPerWeek: number;
}): {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
} | null {
  const { sourceField, sourceAmount, hoursPerWeek, daysPerWeek } = input;
  if (![sourceAmount, hoursPerWeek, daysPerWeek].every(Number.isFinite)) {
    return null;
  }
  if (sourceAmount < 0) return null;
  if (!(hoursPerWeek > 0) || !(daysPerWeek > 0)) return null;

  let weekly: number;
  if (sourceField === 'hourly') {
    weekly = sourceAmount * hoursPerWeek;
  } else if (sourceField === 'daily') {
    weekly = sourceAmount * daysPerWeek;
  } else {
    weekly = sourceAmount;
  }

  if (!Number.isFinite(weekly) || weekly < 0) return null;

  const yearly = weekly * WEEKS_PER_YEAR;
  const monthly = yearly / 12;
  const hourly =
    sourceField === 'hourly' ? sourceAmount : weekly / hoursPerWeek;
  const daily = sourceField === 'daily' ? sourceAmount : weekly / daysPerWeek;

  if (![hourly, daily, weekly, monthly, yearly].every(Number.isFinite)) {
    return null;
  }
  if ([hourly, daily, weekly, monthly, yearly].some((v) => v < 0)) {
    return null;
  }

  return { hourly, daily, weekly, monthly, yearly };
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
