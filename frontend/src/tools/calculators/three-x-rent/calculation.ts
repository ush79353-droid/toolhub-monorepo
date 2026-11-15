import {
  RESULT_CAP,
  type TenantLine,
  type ThreeXRentInput,
  type ThreeXRentResult,
} from './types';
import { validateThreeXRent } from './validation';

/** Money is rounded to the nearest hundredth. Display currency does not convert it. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

/**
 * Split a money total by weights. Leftover cents go to the largest fractional parts.
 * ponytail: cent rounding cannot represent every ratio. Upgrade path: keep rational cents if a lease needs an exact fraction.
 */
export function splitMoney(total: number, weights: readonly number[]): number[] {
  const cents = Math.round(roundMoney(total) * 100);
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  if (!Number.isFinite(cents) || !(sum > 0) || weights.some((weight) => !Number.isFinite(weight) || weight < 0)) {
    return [];
  }
  const exact = weights.map((weight) => (cents * weight) / sum);
  const floors = exact.map((value) => Math.floor(value + 1e-9));
  let used = floors.reduce((acc, value) => acc + value, 0);
  const order = exact
    .map((value, index) => ({ index, frac: value - Math.floor(value + 1e-9) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  let cursor = 0;
  while (used < cents && order.length > 0) {
    const slot = order[cursor % order.length];
    if (slot === undefined) break;
    floors[slot.index] = (floors[slot.index] ?? 0) + 1;
    used += 1;
    cursor += 1;
    if (cursor > cents + order.length) break;
  }
  return floors.map((value) => value / 100);
}

export function equalSharePercents(count: number): number[] {
  if (!Number.isInteger(count) || count < 1) return [];
  return splitMoney(
    100,
    Array.from({ length: count }, () => 1),
  );
}

function sumMoney(values: readonly number[]): number {
  const cents = values.reduce((acc, value) => acc + Math.round(value * 100), 0);
  return cents / 100;
}

function linesFromShares(monthlyTotal: number, annualTotal: number, weights: readonly number[]): TenantLine[] {
  const monthlyParts = splitMoney(monthlyTotal, weights);
  const annualParts = splitMoney(annualTotal, weights);
  const percentParts = splitMoney(100, weights);
  return monthlyParts.map((monthly, index) => ({
    label: `Tenant ${index + 1}`,
    monthly,
    annual: annualParts[index] ?? roundMoney(monthly * 12),
    sharePercent: percentParts[index] ?? 0,
  }));
}

export function calculateThreeXRent(input: ThreeXRentInput): ThreeXRentResult | null {
  if (!validateThreeXRent(input).isValid) return null;
  const multiplier = input.multiplier;
  if (multiplier === null || !(multiplier > 0)) return null;

  const rentToIncomePercent = roundMoney(100 / multiplier);
  if (!Number.isFinite(rentToIncomePercent)) return null;

  if (input.mode === 'required-income') {
    if (input.monthlyRent === null) return null;
    const requiredMonthlyIncome = roundMoney(input.monthlyRent * multiplier);
    const requiredAnnualIncome = roundMoney(requiredMonthlyIncome * 12);
    if (
      !Number.isFinite(requiredMonthlyIncome) ||
      !Number.isFinite(requiredAnnualIncome) ||
      requiredAnnualIncome > RESULT_CAP
    ) {
      return null;
    }

    const multiple = input.multipleTenants && input.tenantCount !== null && input.tenantCount >= 2;
    const weights = !multiple
      ? []
      : input.split === 'custom'
        ? input.sharePercents.map((share) => share ?? 0)
        : Array.from({ length: input.tenantCount ?? 0 }, () => 1);
    const tenantLines = multiple ? linesFromShares(requiredMonthlyIncome, requiredAnnualIncome, weights) : [];
    if (multiple && tenantLines.length !== weights.length) return null;

    return {
      mode: input.mode,
      currency: input.currency,
      multiplier,
      rentToIncomePercent,
      monthlyRent: input.monthlyRent,
      requiredMonthlyIncome,
      requiredAnnualIncome,
      grossMonthlyIncome: null,
      grossAnnualIncome: null,
      maximumMonthlyRent: null,
      maximumAnnualRent: null,
      multipleTenants: multiple,
      split: multiple ? input.split : 'single',
      tenantLines,
    };
  }

  const incomes = input.multipleTenants
    ? input.tenantIncomes.slice(0, input.tenantCount ?? 0).map((income) => income ?? Number.NaN)
    : [input.grossMonthlyIncome ?? Number.NaN];
  if (incomes.some((income) => !Number.isFinite(income) || income < 0)) return null;

  const grossMonthlyIncome = sumMoney(incomes);
  const grossAnnualIncome = roundMoney(grossMonthlyIncome * 12);
  const maximumMonthlyRent = roundMoney(grossMonthlyIncome / multiplier);
  const maximumAnnualRent = roundMoney(maximumMonthlyRent * 12);
  if (
    [grossMonthlyIncome, grossAnnualIncome, maximumMonthlyRent, maximumAnnualRent].some(
      (amount) => !Number.isFinite(amount) || amount > RESULT_CAP,
    )
  ) {
    return null;
  }

  const multiple = input.multipleTenants && incomes.length >= 2;
  const percentParts =
    multiple && grossMonthlyIncome > 0 ? splitMoney(100, incomes) : incomes.map(() => 0);
  const tenantLines: TenantLine[] = multiple
    ? incomes.map((income, index) => ({
        label: `Tenant ${index + 1}`,
        monthly: roundMoney(income),
        annual: roundMoney(income * 12),
        sharePercent: percentParts[index] ?? 0,
      }))
    : [];

  return {
    mode: input.mode,
    currency: input.currency,
    multiplier,
    rentToIncomePercent,
    monthlyRent: null,
    requiredMonthlyIncome: null,
    requiredAnnualIncome: null,
    grossMonthlyIncome,
    grossAnnualIncome,
    maximumMonthlyRent,
    maximumAnnualRent,
    multipleTenants: multiple,
    split: multiple ? 'custom' : 'single',
    tenantLines,
  };
}
