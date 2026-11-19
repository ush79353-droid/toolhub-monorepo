import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LossRatioInput {
  premiumsEarned: string;
  claimsPaid: string;
  lossAdjustmentExpenses: string;
  financialOpen: boolean;
  currency: SupportedCurrency;
}

export interface LossRatioResult {
  premiumsEarned: number;
  claimsPaid: number;
  lossAdjustmentExpenses: number;
  totalLossRelatedCosts: number;
  lossRatio: number;
  premiumsRemaining: number;
  interpretation: string;
  currency: SupportedCurrency;
  formattedPremiumsEarned: string;
  formattedClaimsPaid: string;
  formattedLossAdjustmentExpenses: string;
  formattedTotalLossRelatedCosts: string;
  formattedPremiumsRemaining: string;
  formattedLossRatio: string;
}

export type LossRatioFieldErrors = {
  premiumsEarned?: string;
  claimsPaid?: string;
  lossAdjustmentExpenses?: string;
  form?: string;
};

export function createDefaultInput(): LossRatioInput {
  return {
    premiumsEarned: '',
    claimsPaid: '',
    lossAdjustmentExpenses: '',
    financialOpen: true,
    currency: 'PKR',
  };
}

/** Spec Company Alpha example → 53% (use same magnitudes in selected currency). */
export function createExampleInput(): LossRatioInput {
  return {
    premiumsEarned: '10000000',
    claimsPaid: '3500000',
    lossAdjustmentExpenses: '1800000',
    financialOpen: true,
    currency: 'PKR',
  };
}
