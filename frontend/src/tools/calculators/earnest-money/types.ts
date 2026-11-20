import type { SupportedCurrency } from '@/tools/shared/currency';

/** Explicit calculation direction — avoids circular field updates. */
export type EarnestMoneyMode = 'deposit' | 'percentage' | 'propertyPrice';

export interface EarnestMoneyInput {
  mode: EarnestMoneyMode;
  propertyPrice: string;
  earnestMoneyPercentage: string;
  earnestMoneyAmount: string;
  currency: SupportedCurrency;
}

export interface EarnestMoneyResult {
  propertyPrice: number;
  earnestMoneyPercentage: number;
  earnestMoneyAmount: number;
  currency: SupportedCurrency;
  formattedPropertyPrice: string;
  formattedEarnestMoneyPercentage: string;
  formattedEarnestMoneyAmount: string;
}

export type EarnestMoneyFieldErrors = {
  propertyPrice?: string;
  earnestMoneyPercentage?: string;
  earnestMoneyAmount?: string;
  form?: string;
};

export function createDefaultInput(): EarnestMoneyInput {
  return {
    mode: 'deposit',
    propertyPrice: '',
    earnestMoneyPercentage: '',
    earnestMoneyAmount: '',
    currency: 'PKR',
  };
}
