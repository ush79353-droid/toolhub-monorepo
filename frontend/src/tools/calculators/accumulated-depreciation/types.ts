import type { SupportedCurrency } from '@/tools/shared/currency';

export const DEPRECIATION_METHODS = [
  'straight-line',
  'declining-balance',
  'sum-of-years-digits',
  'units-of-production',
] as const;

export type DepreciationMethod = (typeof DEPRECIATION_METHODS)[number];

/** Fixed double-declining (200%) convention when the reference does not name a rate. */
export const DECLINING_BALANCE_FACTOR = 2;

export interface AccumulatedDepreciationInput {
  method: DepreciationMethod;
  assetCost: number;
  usefulLifeYears: number;
  yearsElapsed: number;
  salvageValue: number;
  /** Units-of-production only. */
  estimatedLifetimeUnits: number;
  /** Units-of-production only. Cumulative units through the reporting date. */
  unitsProduced: number;
  currency: SupportedCurrency;
}

export interface AccumulatedDepreciationResult {
  defined: boolean;
  explanation: string | null;
  method: DepreciationMethod;
  assetCost: number;
  salvageValue: number;
  usefulLifeYears: number | null;
  yearsElapsed: number | null;
  estimatedLifetimeUnits: number | null;
  unitsProduced: number | null;
  /** Double-declining rate = factor / useful life. Null outside declining-balance. */
  decliningBalanceRate: number | null;
  depreciableAmount: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  currency: SupportedCurrency;
}

export type AccumulatedDepreciationFieldErrors = Record<string, string>;

export function createDefaultAccumulatedDepreciationInput(): AccumulatedDepreciationInput {
  return {
    method: 'straight-line',
    assetCost: 25000,
    usefulLifeYears: 15,
    yearsElapsed: 2,
    salvageValue: 3000,
    estimatedLifetimeUnits: 100_000,
    unitsProduced: 10_000,
    currency: 'USD',
  };
}

export function methodUsesYears(method: DepreciationMethod): boolean {
  return method !== 'units-of-production';
}

export function methodUsesProduction(method: DepreciationMethod): boolean {
  return method === 'units-of-production';
}
