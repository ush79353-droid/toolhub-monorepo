/**
 * Salary period conversions — UI scaffold.
 * Formulas land in the engine commit.
 */
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const WEEKS_PER_YEAR = 52;

export function calculateSalary(_input: {
  hourlyPay: number;
  hoursPerDay: number;
  daysPerWeek: number;
}): {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hoursPerWeek: number;
  annualScheduledDays: number;
} | null {
  return null;
}

/** Display rounding only — never used inside the formulas. */
export function formatSalaryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
