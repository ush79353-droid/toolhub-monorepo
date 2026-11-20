import type { SupportedCurrency } from '@/tools/shared/currency';

export type TimeUnit = 'years' | 'months';

export interface ActualCashValueInput {
  purchasePrice: string;
  expectedLife: string;
  expectedLifeUnit: TimeUnit;
  currentAge: string;
  currentAgeUnit: TimeUnit;
  currency: SupportedCurrency;
}

export interface ActualCashValueResult {
  purchasePrice: number;
  expectedLifeMonths: number;
  currentAgeMonths: number;
  actualCashValue: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
  accumulatedDepreciation: number;
  depreciationPercentage: number;
  remainingValuePercentage: number;
  remainingUsefulLifeMonths: number;
  beyondUsefulLife: boolean;
  currency: SupportedCurrency;
  formattedPurchasePrice: string;
  formattedActualCashValue: string;
  formattedAnnualDepreciation: string;
  formattedMonthlyDepreciation: string;
  formattedAccumulatedDepreciation: string;
  formattedDepreciationPercentage: string;
  formattedRemainingValuePercentage: string;
  formattedRemainingUsefulLife: string;
}

export type ActualCashValueFieldErrors = {
  purchasePrice?: string;
  expectedLife?: string;
  currentAge?: string;
  form?: string;
};

export function createDefaultInput(): ActualCashValueInput {
  return {
    purchasePrice: '',
    expectedLife: '',
    expectedLifeUnit: 'years',
    currentAge: '',
    currentAgeUnit: 'years',
    currency: 'PKR',
  };
}
