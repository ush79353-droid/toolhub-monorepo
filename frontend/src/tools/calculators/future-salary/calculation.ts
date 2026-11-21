import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface FutureSalaryCalculationInput {
  /** Current salary already in one currency. */
  currentSalary: number;
  /** Average salary change per year (%). May be zero or negative (>-100). */
  salaryGrowthPercent: number;
  /** Number of years (≥ 0). */
  years: number;
  /** Average inflation per year (%). May be zero or negative (>-100). */
  inflationPercent: number;
}

export interface FutureSalaryCalculationResult {
  futureSalary: number;
  realSalary: number;
}

/**
 * Compound salary growth and inflation-adjusted real purchasing power.
 * Money inputs must already share one currency. Growth/inflation % and years
 * are never FX-converted.
 *
 * Future = Current × (1 + g/100)^n
 * Real = Future ÷ (1 + i/100)^n
 *
 * Rejects nonfinite inputs, years < 0, and factors ≤ 0 (growth or inflation
 * ≤ −100%). Returns null when the result is nonfinite.
 */
export function calculateFutureSalary(
  input: FutureSalaryCalculationInput
): FutureSalaryCalculationResult | null {
  const { currentSalary, salaryGrowthPercent, years, inflationPercent } = input;

  if (
    ![currentSalary, salaryGrowthPercent, years, inflationPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  if (!(years >= 0)) return null;

  const growthFactor = 1 + salaryGrowthPercent / 100;
  const inflationFactor = 1 + inflationPercent / 100;
  if (!(growthFactor > 0) || !(inflationFactor > 0)) return null;

  const futureSalary = currentSalary * Math.pow(growthFactor, years);
  if (!Number.isFinite(futureSalary)) return null;

  const realSalary = futureSalary / Math.pow(inflationFactor, years);
  if (!Number.isFinite(realSalary)) return null;

  return { futureSalary, realSalary };
}

/** Display rounding only — never used inside formulas. */
export function formatFutureSalaryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
