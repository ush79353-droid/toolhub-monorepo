import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SalaryFrequency } from './types';

/** Working-day estimate assumptions (disclosed in UI). */
export const WORKING_DAYS_PER_YEAR = 260;
export const WORKING_DAYS_PER_WEEK = 5;
export const WORKING_HOURS_PER_DAY = 8;
export const WEEKS_PER_YEAR = 52;

/**
 * Leave payout = daily base pay × leave days.
 *
 * Daily from frequency:
 *   Annual  → Annual / 260
 *   Monthly → (Monthly × 12) / 260
 *   Weekly  → Weekly / 5
 *   Hourly  → Hourly × 8
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateLeavePayout(input: {
  frequency: SalaryFrequency;
  basePay: number;
  leaveDays: number;
}): { dailyPay: number; payout: number } | null {
  const { frequency, basePay, leaveDays } = input;
  if (![basePay, leaveDays].every(Number.isFinite)) return null;
  if (basePay < 0 || leaveDays < 0) return null;

  let dailyPay: number;
  if (frequency === 'annual') {
    dailyPay = basePay / WORKING_DAYS_PER_YEAR;
  } else if (frequency === 'monthly') {
    dailyPay = (basePay * 12) / WORKING_DAYS_PER_YEAR;
  } else if (frequency === 'weekly') {
    dailyPay = basePay / WORKING_DAYS_PER_WEEK;
  } else {
    dailyPay = basePay * WORKING_HOURS_PER_DAY;
  }

  if (!Number.isFinite(dailyPay) || dailyPay < 0) return null;
  const payout = dailyPay * leaveDays;
  if (!Number.isFinite(payout) || payout < 0) return null;
  return { dailyPay, payout };
}

export function formatLeaveMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
