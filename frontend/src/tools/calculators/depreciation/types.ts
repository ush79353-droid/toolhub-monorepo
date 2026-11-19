import type { SupportedCurrency } from '@/tools/shared/currency';

export const DEPRECIATION_METHODS = [
  'straight-line',
  'declining-balance',
  'sum-of-years-digits',
] as const;

export type DepreciationMethod = (typeof DEPRECIATION_METHODS)[number];

/** Double-declining convention: rate = factor / useful life. */
export const DEFAULT_DECLINING_BALANCE_FACTOR = 2;

export interface DepreciationInput {
  method: DepreciationMethod;
  originalCost: string;
  originalCostCurrency: SupportedCurrency;
  salvageValue: string;
  salvageValueCurrency: SupportedCurrency;
  lifetimeYears: string;
  endBookAfterYears: string;
  /** Declining-balance annual rate percent (e.g. 40 for 40%). Shown only for that method. */
  decliningBalanceRatePercent: string;
  expenseCurrency: SupportedCurrency;
  endBookCurrency: SupportedCurrency;
}

export interface DepreciationResult {
  method: DepreciationMethod;
  calcCurrency: SupportedCurrency;
  originalCostCanonical: number;
  salvageValueCanonical: number;
  lifetimeYears: number;
  endBookAfterYears: number;
  decliningBalanceRate: number | null;
  /** Depreciation expense for the selected year (not cumulative). */
  depreciationExpenseCanonical: number;
  endBookValueCanonical: number;
  depreciationExpenseDisplay: number;
  endBookValueDisplay: number;
  expenseCurrency: SupportedCurrency;
  endBookCurrency: SupportedCurrency;
  formattedDepreciationExpense: string;
  formattedEndBookValue: string;
  summaryText: string;
}

export type DepreciationFieldErrors = {
  method?: string;
  originalCost?: string;
  salvageValue?: string;
  lifetimeYears?: string;
  endBookAfterYears?: string;
  decliningBalanceRatePercent?: string;
  form?: string;
};

export function suggestedDecliningBalanceRatePercent(lifetimeYears: number): number {
  if (!Number.isFinite(lifetimeYears) || lifetimeYears <= 0) return Number.NaN;
  return (DEFAULT_DECLINING_BALANCE_FACTOR / lifetimeYears) * 100;
}

export function createDefaultInput(): DepreciationInput {
  const lifetime = 5;
  return {
    method: 'straight-line',
    originalCost: '',
    originalCostCurrency: 'PKR',
    salvageValue: '',
    salvageValueCurrency: 'PKR',
    lifetimeYears: String(lifetime),
    endBookAfterYears: '2',
    decliningBalanceRatePercent: String(suggestedDecliningBalanceRatePercent(lifetime)),
    expenseCurrency: 'PKR',
    endBookCurrency: 'PKR',
  };
}

export function inputsEqual(a: DepreciationInput, b: DepreciationInput): boolean {
  return (
    a.method === b.method &&
    a.originalCost === b.originalCost &&
    a.originalCostCurrency === b.originalCostCurrency &&
    a.salvageValue === b.salvageValue &&
    a.salvageValueCurrency === b.salvageValueCurrency &&
    a.lifetimeYears === b.lifetimeYears &&
    a.endBookAfterYears === b.endBookAfterYears &&
    a.decliningBalanceRatePercent === b.decliningBalanceRatePercent &&
    a.expenseCurrency === b.expenseCurrency &&
    a.endBookCurrency === b.endBookCurrency
  );
}
