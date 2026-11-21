import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AnnualSalaryProjection,
  LifetimeEarningsInput,
  LifetimeEarningsResult,
} from './types';

export function parseOptionalNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function calculateWorkingYearsLeft(
  currentAge: number,
  retirementAge: number,
): number {
  return retirementAge - currentAge;
}

/**
 * Salary after `completedRaises` annual increases.
 * completedRaises=0 → current salary (year 1).
 * completedRaises=1 → current × (1+g) (year 2).
 */
export function calculateAnnualSalary(
  currentSalary: number,
  growthRatePercent: number,
  completedRaises: number,
): number {
  return (
    currentSalary * Math.pow(1 + growthRatePercent / 100, completedRaises)
  );
}

/**
 * Sum of N years: S0 + S0(1+g) + … + S0(1+g)^(N−1)
 * = S0 × ((1+g)^N − 1) / g
 */
export function calculateLifetimeEarnings(
  currentSalary: number,
  growthRatePercent: number,
  workingYears: number,
): number | null {
  if (!(currentSalary >= 0) || !(workingYears > 0)) return null;
  const g = growthRatePercent / 100;
  if (Math.abs(g) < 1e-15) return currentSalary * workingYears;
  if (g <= -1) return null;
  const factor = (Math.pow(1 + g, workingYears) - 1) / g;
  const total = currentSalary * factor;
  return Number.isFinite(total) ? total : null;
}

export function generateSalaryProjection(input: {
  currentAge: number;
  currentSalary: number;
  growthRatePercent: number;
  workingYears: number;
}): AnnualSalaryProjection[] {
  const { currentAge, currentSalary, growthRatePercent, workingYears } = input;
  const rows: AnnualSalaryProjection[] = [];
  let cumulative = 0;
  for (let year = 1; year <= workingYears; year += 1) {
    const annualSalary = calculateAnnualSalary(
      currentSalary,
      growthRatePercent,
      year - 1,
    );
    cumulative += annualSalary;
    rows.push({
      year,
      age: currentAge + year - 1,
      annualSalary,
      cumulativeEarnings: cumulative,
    });
  }
  return rows;
}

export function formatLifetimeMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(amount));
}

export function formatLifetimePercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(percent);
}

export interface LifetimeEarningsEngineValues {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  annualSalaryIncreasePercent: number;
  currency: SupportedCurrency;
}

export function calculateLifetimeEarningsResults(
  values: LifetimeEarningsEngineValues,
): LifetimeEarningsResult | null {
  const workingYears = calculateWorkingYearsLeft(
    values.currentAge,
    values.retirementAge,
  );
  if (!(workingYears > 0)) return null;

  const lifetimeEarnings = calculateLifetimeEarnings(
    values.currentSalary,
    values.annualSalaryIncreasePercent,
    workingYears,
  );
  if (lifetimeEarnings === null) return null;

  const finalYearSalary = calculateAnnualSalary(
    values.currentSalary,
    values.annualSalaryIncreasePercent,
    workingYears - 1,
  );
  const projection = generateSalaryProjection({
    currentAge: values.currentAge,
    currentSalary: values.currentSalary,
    growthRatePercent: values.annualSalaryIncreasePercent,
    workingYears,
  });

  const symbol = getCurrencySymbol(values.currency);
  const money = (v: number) =>
    `${symbol}${formatLifetimeMoney(v, values.currency)}`;

  const summaryText = `Based on your current annual salary of ${money(values.currentSalary)} and an expected annual increase of ${formatLifetimePercent(values.annualSalaryIncreasePercent)}%, you could earn an estimated total of ${money(lifetimeEarnings)} over your remaining ${workingYears} working years. This is an estimate of gross salary before taxes, deductions, and inflation adjustments.`;

  return {
    workingYearsLeft: workingYears,
    currentAge: values.currentAge,
    retirementAge: values.retirementAge,
    currentSalary: values.currentSalary,
    salaryGrowthRatePercent: values.annualSalaryIncreasePercent,
    finalYearSalary,
    lifetimeEarnings,
    currency: values.currency,
    projection,
    summaryText,
  };
}

export function shareLifetimeEarningsText(
  result: LifetimeEarningsResult,
): string {
  const symbol = getCurrencySymbol(result.currency);
  const money = (v: number) =>
    `${symbol}${formatLifetimeMoney(v, result.currency)}`;
  return [
    'Lifetime Earnings Calculator',
    `Current age: ${result.currentAge}`,
    `Retirement age: ${result.retirementAge}`,
    `Working years left: ${result.workingYearsLeft}`,
    `Current annual salary: ${money(result.currentSalary)}`,
    `Expected annual increase: ${formatLifetimePercent(result.salaryGrowthRatePercent)}%`,
    `Final-year salary: ${money(result.finalYearSalary)}`,
    `Lifetime earnings: ${money(result.lifetimeEarnings)}`,
    result.summaryText,
  ].join('\n');
}

export function isLifetimeEarningsInputBlank(
  input: LifetimeEarningsInput,
): boolean {
  return (
    !input.currentAge.trim() &&
    !input.retirementAge.trim() &&
    !input.currentSalary.trim() &&
    !input.annualSalaryIncrease.trim()
  );
}
