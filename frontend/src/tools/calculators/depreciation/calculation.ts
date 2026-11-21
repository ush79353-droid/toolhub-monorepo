import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DepreciationMethod } from './types';

export interface DepreciationEngineInput {
  method: DepreciationMethod;
  originalCost: number;
  salvageValue: number;
  lifetimeYears: number;
  endBookAfterYears: number;
  /** Annual declining-balance rate as a decimal (e.g. 0.4 for 40%). Required for declining-balance. */
  decliningBalanceRate: number | null;
}

export interface DepreciationEngineResult {
  method: DepreciationMethod;
  lifetimeYears: number;
  endBookAfterYears: number;
  decliningBalanceRate: number | null;
  /** Expense for the selected year only. */
  depreciationExpense: number;
  /** Book value after endBookAfterYears. */
  endBookValue: number;
  accumulatedDepreciation: number;
}

function finite(...values: number[]): boolean {
  return values.every(Number.isFinite);
}

/**
 * Straight line:
 *   Annual = (Cost − Salvage) / Life
 *   Expense year t = Annual (1 ≤ t ≤ Life)
 *   Book after t = Cost − Annual × t
 */
export function straightLineYear(
  cost: number,
  salvage: number,
  life: number,
  year: number
): { expense: number; endBook: number; accumulated: number } | null {
  if (!finite(cost, salvage, life, year) || life <= 0 || year < 0 || year > life) {
    return null;
  }
  if (cost < salvage || salvage < 0) return null;
  const annual = (cost - salvage) / life;
  if (!Number.isFinite(annual) || annual < 0) return null;
  const accumulated = annual * year;
  const expense = year === 0 ? 0 : annual;
  const endBook = cost - accumulated;
  if (!finite(expense, endBook, accumulated)) return null;
  if (endBook + 1e-12 < salvage) return null;
  return { expense, endBook, accumulated };
}

/**
 * Declining balance with salvage floor:
 *   Dep_k = min(Begin × Rate, Begin − Salvage)
 * Expense is Dep for the selected year; book is after that many years.
 */
export function decliningBalanceYear(
  cost: number,
  salvage: number,
  life: number,
  year: number,
  rate: number
): { expense: number; endBook: number; accumulated: number } | null {
  if (!finite(cost, salvage, life, year, rate)) return null;
  if (life <= 0 || year < 0 || year > life) return null;
  if (cost < salvage || salvage < 0) return null;
  if (!(rate > 0)) return null;

  let book = cost;
  let accumulated = 0;
  let expense = 0;

  for (let k = 1; k <= year; k += 1) {
    const room = book - salvage;
    if (room <= 0) {
      expense = 0;
      break;
    }
    const raw = book * rate;
    if (!Number.isFinite(raw) || raw < 0) return null;
    const dep = Math.min(raw, room);
    if (!Number.isFinite(dep) || dep < 0) return null;
    expense = dep;
    accumulated += dep;
    book -= dep;
  }

  if (year === 0) expense = 0;
  if (!finite(expense, book, accumulated)) return null;
  if (book + 1e-12 < salvage) return null;
  return { expense, endBook: book, accumulated };
}

/**
 * Sum-of-years' digits:
 *   SYD = n(n+1)/2
 *   Year k = (Cost − Salvage) × (n − k + 1) / SYD
 */
export function sumOfYearsDigitsYear(
  cost: number,
  salvage: number,
  life: number,
  year: number
): { expense: number; endBook: number; accumulated: number } | null {
  if (!finite(cost, salvage, life, year) || life <= 0 || year < 0 || year > life) {
    return null;
  }
  if (cost < salvage || salvage < 0) return null;
  const depreciable = cost - salvage;
  const syd = (life * (life + 1)) / 2;
  if (!(syd > 0)) return null;

  let accumulated = 0;
  let expense = 0;
  for (let k = 1; k <= year; k += 1) {
    const remainingLife = life - k + 1;
    const dep = (depreciable * remainingLife) / syd;
    if (!Number.isFinite(dep) || dep < 0) return null;
    expense = dep;
    accumulated += dep;
  }
  if (year === 0) expense = 0;
  const endBook = cost - accumulated;
  if (!finite(expense, endBook, accumulated)) return null;
  if (endBook + 1e-12 < salvage) return null;
  return { expense, endBook, accumulated };
}

export function calculateDepreciation(
  input: DepreciationEngineInput
): DepreciationEngineResult | null {
  const {
    method,
    originalCost,
    salvageValue,
    lifetimeYears,
    endBookAfterYears,
    decliningBalanceRate,
  } = input;

  if (!finite(originalCost, salvageValue, lifetimeYears, endBookAfterYears)) {
    return null;
  }
  if (originalCost < salvageValue || salvageValue < 0) return null;
  if (!Number.isInteger(lifetimeYears) || lifetimeYears <= 0) return null;
  if (!Number.isInteger(endBookAfterYears) || endBookAfterYears < 0) return null;
  if (endBookAfterYears > lifetimeYears) return null;

  let computed: { expense: number; endBook: number; accumulated: number } | null = null;
  let rateUsed: number | null = null;

  if (method === 'straight-line') {
    computed = straightLineYear(
      originalCost,
      salvageValue,
      lifetimeYears,
      endBookAfterYears
    );
  } else if (method === 'declining-balance') {
    if (decliningBalanceRate === null || !Number.isFinite(decliningBalanceRate)) {
      return null;
    }
    if (!(decliningBalanceRate > 0)) return null;
    rateUsed = decliningBalanceRate;
    computed = decliningBalanceYear(
      originalCost,
      salvageValue,
      lifetimeYears,
      endBookAfterYears,
      decliningBalanceRate
    );
  } else if (method === 'sum-of-years-digits') {
    computed = sumOfYearsDigitsYear(
      originalCost,
      salvageValue,
      lifetimeYears,
      endBookAfterYears
    );
  } else {
    return null;
  }

  if (!computed) return null;
  if (computed.expense < 0 || computed.endBook < salvageValue - 1e-12) return null;

  return {
    method,
    lifetimeYears,
    endBookAfterYears,
    decliningBalanceRate: rateUsed,
    depreciationExpense: computed.expense,
    endBookValue: computed.endBook,
    accumulatedDepreciation: computed.accumulated,
  };
}

/** Display rounding only. */
export function formatDepreciationMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  if (!Number.isFinite(amount)) return '';
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  const rounded = Math.round((amount + Number.EPSILON) * factor) / factor;
  if (Object.is(rounded, -0) || rounded === 0) {
    return (0).toFixed(digits);
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rounded);
}

export function methodLabel(method: DepreciationMethod): string {
  switch (method) {
    case 'straight-line':
      return 'Straight line';
    case 'declining-balance':
      return 'Declining balance';
    case 'sum-of-years-digits':
      return "Sum-of-years' digits";
    default:
      return method;
  }
}
