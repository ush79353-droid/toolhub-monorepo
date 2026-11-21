import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateYearlyWage,
  formatYearlyWageMoney,
} from '../yearly-wage/calculation';

/**
 * Annual pay from hourly wage — reuses Yearly Wage formulas (same family as
 * Annual Salary / Annual Income / Yearly Wage):
 *   Annual Pay = Hourly Wage × Hours Per Week × Weeks Per Year
 *   Net Hourly = Hourly Wage × (1 − Tax / 100)
 *   Net Annual = Annual Pay × (1 − Tax / 100)
 *
 * Tax is a simplified flat rate — not jurisdiction-specific payroll.
 * Returns full-precision amounts. Rejects non-finite inputs.
 */
export function calculateAnnualPay(input: {
  hourlyWage: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  taxPercent: number;
}): {
  annualPay: number;
  netHourly: number;
  netAnnual: number;
} | null {
  const computed = calculateYearlyWage(input);
  if (!computed) return null;
  return {
    annualPay: computed.yearlyWage,
    netHourly: computed.netHourly,
    netAnnual: computed.netYearly,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatAnnualPayMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  return formatYearlyWageMoney(amount, currency);
}