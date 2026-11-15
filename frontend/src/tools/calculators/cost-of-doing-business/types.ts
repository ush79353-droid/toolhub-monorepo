import type { SupportedCurrency } from '@/tools/shared/currency';

export interface CostOfDoingBusinessInput {
  totalAnnualCost: number;
  billableDays: number;
  currency: SupportedCurrency;
}

export interface CostOfDoingBusinessResult {
  totalAnnualCost: number;
  billableDays: number;
  costPerBillableDay: number;
  currency: SupportedCurrency;
  costDisplay: string;
  shareCost: string;
}

export type CostOfDoingBusinessFieldErrors = Record<string, string>;

export function createDefaultInput(): CostOfDoingBusinessInput {
  return {
    totalAnnualCost: Number.NaN,
    billableDays: Number.NaN,
    currency: 'PKR',
  };
}
