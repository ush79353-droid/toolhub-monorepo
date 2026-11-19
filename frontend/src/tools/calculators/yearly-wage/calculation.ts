import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Yearly wage from hourly wage (same family as Annual Salary Calculator):
 *   Yearly Wage = Hourly Wage × Hours Per Week × Weeks Per Year
 *   Net Hourly  = Hourly Wage × (1 − Tax / 100)
 *   Net Yearly  = Yearly Wage × (1 − Tax / 100)
 *
 * Clamp: nonnegative hours/wage; weeks 0–52 inclusive; tax 0–100 inclusive.
 * Tax is a simplified flat rate — not jurisdiction-specific payroll.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateYearlyWage(input: {
  hourlyWage: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  taxPercent: number;
}): {
  yearlyWage: number;
  netHourly: number;
  netYearly: number;
} | null {
  const { hourlyWage, hoursPerWeek, weeksPerYear, taxPercent } = input;
  if (
    ![hourlyWage, hoursPerWeek, weeksPerYear, taxPercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (hourlyWage < 0 || hoursPerWeek < 0) return null;
  if (weeksPerYear < 0 || weeksPerYear > 52) return null;
  if (taxPercent < 0 || taxPercent > 100) return null;

  const yearlyWage = hourlyWage * hoursPerWeek * weeksPerYear;
  const keep = 1 - taxPercent / 100;
  const netHourly = hourlyWage * keep;
  const netYearly = yearlyWage * keep;

  if (![yearlyWage, netHourly, netYearly].every(Number.isFinite)) {
    return null;
  }

  return { yearlyWage, netHourly, netYearly };
}

/** Display rounding only — never used inside the formulas. */
export function formatYearlyWageMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
