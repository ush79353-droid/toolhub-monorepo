import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/**
 * Client bill rate from annual salary:
 *   Base Hourly Cost = Annual Salary / Capacity
 *   Bill Rate = Base Hourly Cost × Multiplier
 *   (equiv.) Bill Rate = (Annual Salary × Multiplier) / Capacity
 *
 * Capacity is annual billable hours (default 2,080 = 40×52).
 * Multiplier is user-defined overhead/margin uplift (default 4).
 * Salary ≥ 0; capacity > 0; multiplier ≥ 0. Zero salary/multiplier allowed.
 * Full precision; reject non-finite results and division by zero.
 */
export function calculateBillRate(input: {
  annualSalary: number;
  capacity: number;
  multiplier: number;
}): { baseHourlyCost: number; billRate: number } | null {
  const { annualSalary, capacity, multiplier } = input;
  if (![annualSalary, capacity, multiplier].every(Number.isFinite)) {
    return null;
  }
  if (annualSalary < 0 || multiplier < 0) return null;
  if (!(capacity > 0)) return null;

  const baseHourlyCost = annualSalary / capacity;
  const billRate = (annualSalary * multiplier) / capacity;

  if (![baseHourlyCost, billRate].every(Number.isFinite)) {
    return null;
  }

  return { baseHourlyCost, billRate };
}

/** Display rounding only — never used inside the formulas. */
export function formatBillRateMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
