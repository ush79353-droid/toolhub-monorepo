import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const WEEKS_PER_YEAR = 52;
export const WORKDAYS_PER_WEEK = 5;

/**
 * Convert annual salary into monthly / weekly / daily / hourly wages.
 *
 * Assumptions (disclosed in UI):
 *   monthly = annual / 12
 *   weekly  = annual / 52
 *   daily   = annual / (52 × 5)
 *   hourly  = annual / (52 × hoursPerWeek)
 *
 * Full precision; no display rounding inside formulas.
 */
export function calculateAnnualToMonthly(input: {
  annualSalary: number;
  hoursPerWeek: number;
}): {
  annualHours: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
  annual: number;
} | null {
  const { annualSalary, hoursPerWeek } = input;
  if (![annualSalary, hoursPerWeek].every(Number.isFinite)) return null;
  if (hoursPerWeek <= 0) return null;
  if (annualSalary < 0) return null;

  const annualHours = hoursPerWeek * WEEKS_PER_YEAR;
  if (!(annualHours > 0) || !Number.isFinite(annualHours)) return null;

  const monthly = annualSalary / 12;
  const weekly = annualSalary / WEEKS_PER_YEAR;
  const daily = annualSalary / (WEEKS_PER_YEAR * WORKDAYS_PER_WEEK);
  const hourly = annualSalary / annualHours;

  if (![monthly, weekly, daily, hourly].every(Number.isFinite)) return null;
  if ([monthly, weekly, daily, hourly].some((v) => v < 0)) return null;

  return {
    annualHours,
    monthly,
    weekly,
    daily,
    hourly,
    annual: annualSalary,
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
