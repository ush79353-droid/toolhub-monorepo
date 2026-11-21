import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Annual income from hourly wage:
 *   Annual Income = Hourly Wage × Hours Per Week × Weeks Per Year
 *   Net Hourly    = Hourly Wage × (1 − Tax / 100)
 *   Net Annual    = Annual Income × (1 − Tax / 100)
 *
 * Clamp: nonnegative hours/wage; weeks 0–52; tax 0–100 inclusive.
 * Tax is a simplified flat rate — not jurisdiction-specific payroll.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateAnnualIncome(input: {
  hourlyWage: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  taxPercent: number;
}): {
  annualIncome: number;
  netHourly: number;
  netAnnual: number;
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

  const annualIncome = hourlyWage * hoursPerWeek * weeksPerYear;
  const keep = 1 - taxPercent / 100;
  const netHourly = hourlyWage * keep;
  const netAnnual = annualIncome * keep;

  if (![annualIncome, netHourly, netAnnual].every(Number.isFinite)) {
    return null;
  }

  return { annualIncome, netHourly, netAnnual };
}

/** Display rounding only — never used inside the formulas. */
export function formatAnnualIncomeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
