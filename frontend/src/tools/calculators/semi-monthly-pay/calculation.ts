import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { SemiMonthlyPaySourceField } from './types';

/** Paid weeks per year (disclosed). */
export const WEEKS_PER_YEAR = 52;

/** Calendar months per year. */
export const MONTHS_PER_YEAR = 12;

/**
 * Semi-monthly periods per year (twice per month — not biweekly).
 * Biweekly uses 26; never reuse that divisor here.
 */
export const SEMI_MONTHLY_PERIODS_PER_YEAR = 24;

export interface SemiMonthlyWageBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  semiMonthly: number;
}

/**
 * Convert one authoritative wage into all period equivalents + semi-monthly.
 *
 * Assumptions: 52 weeks/year, 12 months/year, 24 semi-monthly periods/year.
 * Full precision; no display rounding inside the formulas.
 */
export function calculateSemiMonthlyPay(input: {
  sourceField: SemiMonthlyPaySourceField;
  sourceAmount: number;
  hoursPerWeek: number;
  daysPerWeek: number;
}): SemiMonthlyWageBreakdown | null {
  const { sourceField, sourceAmount, hoursPerWeek, daysPerWeek } = input;
  if (![sourceAmount, hoursPerWeek, daysPerWeek].every(Number.isFinite)) {
    return null;
  }
  if (sourceAmount < 0) return null;
  if (!(hoursPerWeek > 0) || !(daysPerWeek > 0)) return null;
  if (daysPerWeek > 7) return null;

  let weekly: number;
  switch (sourceField) {
    case 'hourly':
      weekly = sourceAmount * hoursPerWeek;
      break;
    case 'daily':
      weekly = sourceAmount * daysPerWeek;
      break;
    case 'weekly':
      weekly = sourceAmount;
      break;
    case 'monthly':
      weekly = (sourceAmount * MONTHS_PER_YEAR) / WEEKS_PER_YEAR;
      break;
    case 'yearly':
      weekly = sourceAmount / WEEKS_PER_YEAR;
      break;
    default:
      return null;
  }

  if (!Number.isFinite(weekly) || weekly < 0) return null;

  const yearly = weekly * WEEKS_PER_YEAR;
  const monthly = yearly / MONTHS_PER_YEAR;
  const daily = weekly / daysPerWeek;
  const hourly = weekly / hoursPerWeek;
  const semiMonthly = yearly / SEMI_MONTHLY_PERIODS_PER_YEAR;

  if (
    ![hourly, daily, weekly, monthly, yearly, semiMonthly].every(
      (n) => Number.isFinite(n) && n >= 0,
    )
  ) {
    return null;
  }

  return { hourly, daily, weekly, monthly, yearly, semiMonthly };
}

/** Display rounding only — never used inside the formulas. */
export function formatSemiMonthlyMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
