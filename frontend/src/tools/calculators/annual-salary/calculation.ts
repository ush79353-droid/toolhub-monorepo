import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Annual salary from hourly wage:
 *   Annual Salary = Hourly Wage × Hours Per Week × Weeks Per Year
 *   Net Hourly    = Hourly Wage × (1 − Tax / 100)
 *   Net Annual    = Annual Salary × (1 − Tax / 100)
 *
 * Clamp: nonnegative hours/weeks/wage; tax 0–100 inclusive.
 * Tax is a simplified flat rate — not jurisdiction-specific payroll.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateAnnualSalary(input: {
  hourlyWage: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  taxPercent: number;
}): {
  annualSalary: number;
  netHourly: number;
  netAnnual: number;
} | null {
  const { hourlyWage, hoursPerWeek, weeksPerYear, taxPercent } = input;
  if (
    ![hourlyWage, hoursPerWeek, weeksPerYear, taxPercent].every(Number.isFinite)
  ) {
    return null;
  }
  if (hourlyWage < 0 || hoursPerWeek < 0 || weeksPerYear < 0) return null;
  if (taxPercent < 0 || taxPercent > 100) return null;

  const annualSalary = hourlyWage * hoursPerWeek * weeksPerYear;
  const keep = 1 - taxPercent / 100;
  const netHourly = hourlyWage * keep;
  const netAnnual = annualSalary * keep;

  if (![annualSalary, netHourly, netAnnual].every(Number.isFinite)) {
    return null;
  }

  return { annualSalary, netHourly, netAnnual };
}

/** Display rounding only — never used inside the formulas. */
export function formatAnnualSalaryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
